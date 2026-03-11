const express = require("express");
const cors = require("cors");
const path = require("path");
const { matchRule } = require("./rules");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Chat endpoint
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  const reply = matchRule(message.trim());

  res.json({ reply });
});

// Serve the frontend
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(` Chatbot server running → http://localhost:${PORT}`);
});
