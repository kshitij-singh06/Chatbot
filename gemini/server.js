import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Missing GEMINI_API_KEY in environment. Create a .env file.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT ||
  'You are WellnessBot, a friendly and knowledgeable AI health & wellness companion. ' +
  'You provide general information about fitness, nutrition, mental health, sleep, meditation, ' +
  'and healthy lifestyle habits.\n\n' +
  'RULES:\n' +
  '1. Only discuss health, wellness, fitness, nutrition, mental health, sleep, meditation, and related wellness topics.\n' +
  '2. If asked about unrelated topics (coding, math, history, etc.), politely say: ' +
  '"I\'m WellnessBot and I specialize in health & wellness topics! ' +
  'Feel free to ask me about fitness, nutrition, mental health, or any wellness-related questions."\n' +
  '3. Always include a brief disclaimer when discussing health topics: remind users to consult healthcare professionals.\n' +
  '4. Use a warm, supportive, and encouraging tone.\n' +
  '5. Use markdown formatting: **bold** for emphasis, lists for tips, headings for sections.\n' +
  '6. Never diagnose medical conditions or prescribe specific treatments or medications.\n' +
  '7. Keep responses concise but informative.';

const conversation = {
  history: [],
  maxTurns: 20
};

function extractGeminiError(err) {
  const status = err?.status || err?.response?.status;
  const message = err?.message || err?.response?.data?.error?.message || 'Unknown error.';
  return { status, message };
}

function toClientError({ status, message }) {
  const statusCode = typeof status === 'number' ? status : 500;

  if (statusCode === 400) {
    return {
      status: 400,
      error: 'Bad request to Gemini. Check your input and try again.'
    };
  }

  if (statusCode === 401) {
    return {
      status: 401,
      error: 'Unauthorized. Check your GEMINI_API_KEY.'
    };
  }

  if (statusCode === 403) {
    return {
      status: 403,
      error: 'Forbidden. Your API key may not have access to this model or API.'
    };
  }

  if (statusCode === 404) {
    return {
      status: 404,
      error: `Model not found or not available: ${MODEL_NAME}. Try setting GEMINI_MODEL=gemini-1.5-flash in .env.`
    };
  }

  if (statusCode === 429) {
    return {
      status: 429,
      error:
        'Rate limit / quota exceeded (429). Wait a bit and try again, or check your plan/billing and rate limits in Google AI Studio.'
    };
  }

  const short = typeof message === 'string' ? message.slice(0, 180) : '';
  return {
    status: 500,
    error: short ? `Gemini error. ${short}` : 'Failed to generate response.'
  };
}

function clampHistory(history) {
  const maxMessages = conversation.maxTurns * 2;
  if (history.length <= maxMessages) return history;
  return history.slice(history.length - maxMessages);
}

app.post('/chat', async (req, res) => {
  if (!genAI) {
    return res.status(500).json({
      error: 'Server is not configured with GEMINI_API_KEY.'
    });
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  conversation.history.push({ role: 'user', parts: [{ text: message }] });
  conversation.history = clampHistory(conversation.history);

  let streamResult;
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_PROMPT
    });
    streamResult = await model.generateContentStream({
      contents: conversation.history
    });
  } catch (err) {
    conversation.history.pop();
    const extracted = extractGeminiError(err);
    const clientErr = toClientError(extracted);
    console.error('Gemini stream init error:', {
      status: extracted.status,
      message: extracted.message
    });
    return res.status(clientErr.status).json({ error: clientErr.error });
  }

  // Stream started — switch to SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  let fullText = '';
  try {
    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
      }
    }
  } catch (err) {
    console.error('Gemini stream error:', err.message);
    res.write(`data: ${JSON.stringify({ error: 'Stream interrupted. Please try again.' })}\n\n`);
  }

  if (fullText) {
    conversation.history.push({ role: 'model', parts: [{ text: fullText }] });
    conversation.history = clampHistory(conversation.history);
  }

  res.write('data: [DONE]\n\n');
  res.end();
});

app.post('/clear', (req, res) => {
  conversation.history = [];
  res.json({ ok: true });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
