import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  console.log("📩 Nhận request:", req.body);

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        contents: [
          {
            parts: [
              { text: req.body.message }
            ]
          }
        ]
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data.candidates[0].content.parts[0].text;

    res.json({ reply });
  } catch (e) {
    console.error("❌ Gemini error:", e.response?.data || e.message);
    res.status(500).json({ error: "Gemini failed" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
