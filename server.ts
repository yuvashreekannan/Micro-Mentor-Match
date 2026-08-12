import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily or with safety check
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint: AI Session Digest Generator
app.post("/api/generate-digest", async (req, res) => {
  try {
    const { mentorName, studentName, sessionType, topic, rawTranscript, industry } = req.body;

    const ai = getGenAI();
    let resultJson = null;

    if (ai) {
      try {
        const prompt = `You are an AI assistant for "Bridge", a micro-mentorship platform.
Summarize the following 15-minute mentorship session transcript into a structured concise digest.

Session Context:
- Mentor: ${mentorName || 'Industry Mentor'} (${industry || 'Professional'})
- Student: ${studentName || 'Student'}
- Session Type: ${sessionType || '15-Minute Ask'}
- Topic: ${topic || 'Career Guidance'}
- Raw Transcript/Notes: ${rawTranscript || 'Discussed resume formatting, networking strategies on LinkedIn, and recommended books.'}

Return ONLY valid JSON matching this structure (no markdown fences, just pure JSON):
{
  "keyAdvice": ["Bullet 1", "Bullet 2", "Bullet 3"],
  "resourcesMentioned": ["Resource 1", "Resource 2"],
  "suggestedNextStep": "A clear actionable step for the student within 48 hours",
  "summaryHeadline": "A catchy 1-line summary of the core insight"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          resultJson = JSON.parse(response.text.trim());
        }
      } catch (err) {
        console.warn("Gemini API call warning, using fallback generation:", err);
      }
    }

    // Fallback if AI not available or API key not configured
    if (!resultJson) {
      resultJson = {
        summaryHeadline: `Key takeaways from 15-min ${sessionType || 'session'} on ${topic || 'career strategy'}`,
        keyAdvice: [
          `Tailor bullet points on your profile to highlight measurable impact rather than task descriptions.`,
          `Reach out to 3 cold contacts in ${industry || 'the industry'} using personalized 2-sentence micro-messages.`,
          `Focus on small project deliverables that demonstrate practical end-to-end execution.`
        ],
        resourcesMentioned: [
          `Book: "Designing Your Life" by Bill Burnett`,
          `Tool: Roadmap.sh for domain learning paths`,
          `Community: Bridge Mentorship Insight Hub`
        ],
        suggestedNextStep: `Draft 3 updated resume bullets based on ${mentorName}'s feedback and submit for review.`
      };
    }

    res.json({ success: true, digest: resultJson });
  } catch (error: any) {
    console.error("Error generating session digest:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate digest" });
  }
});

// Vite / Production middleware
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bridge app running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
