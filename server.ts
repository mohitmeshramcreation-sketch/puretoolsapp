import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for AI Text Tools using Gemini API
  app.post("/api/ai/text-tools", async (req, res) => {
    try {
      const { text, tool, option } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required for AI processing." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API key is not configured on this server. Please set it in the Secrets panel." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      let systemInstruction = "";
      let prompt = "";

      switch (tool) {
        case "summarize":
          systemInstruction = "You are an elite content summarizer. Produce a clear, highly polished, reader-friendly summary of the text. Use a short introductory paragraph followed by bullet points mapping out key insights and core decisions. Keep the language natural and engaging. Do not append any meta-commentary.";
          prompt = `Summarize the following text:\n\n${text}`;
          break;
        case "grammar":
          systemInstruction = "You are an elite, professional proofreader. Correct all spelling, grammar, punctuation, phrasing, and style errors. Ensure the text remains true to its original authorial intent, but fully refined, natural, and highly polished. Return ONLY the fully corrected copy.";
          prompt = `Polishing and grammar correction for this text:\n\n${text}`;
          break;
        case "rewrite":
          systemInstruction = `You are a elite, multi-tonal copywriter. Rewrite the user's text in an engaging, effective ${option || "professional"} style while retaining all critical details. Do not reply with comments or meta-text.`;
          prompt = `Rewrite the text:\n\n${text}`;
          break;
        case "improve":
          systemInstruction = "You are a writing improvement expert. Upgrade flow, readability, impact, vocabulary, and active phrasing to provide maximum impact. Maintain matching language, but significantly elevate style and polish. Return the improved text.";
          prompt = `Elevate readability of this text:\n\n${text}`;
          break;
        case "ideas":
          systemInstruction = "You are a ingenious brainstorming and strategy companion. Analyze the input, then produce a highly creative, actionable list of alternative directions, content ideas, growth suggestions, or structural outlines. Make the suggestions clear, numbered, and well-structured.";
          prompt = `Generate brainstorming directions for the input content:\n\n${text}`;
          break;
        default:
          return res.status(400).json({ error: "Invalid tool specified." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ output: response.text });
    } catch (e: any) {
      console.error("Gemini API Integration Error:", e);
      res.status(500).json({ error: e.message || "An error occurred with the AI assistant." });
    }
  });

  // Secure server-side Contact and Feedback inquiry processor
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, topic, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
      }

      // Hardcoded server-side email to shield it completely from browser bundles/logs
      const targetEmail = "mohitmeshramcreation" + "@" + "gmail.com";

      // Forward to a reliable, secure form handler service via Node's native fetch
      // This is processed fully server-side. The client never sees this URL or the email.
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: `PureTool Inquiry: ${topic.toUpperCase()} from ${name}`,
          message: message,
          _honey: "" // anti-spam honeypot
        })
      });

      const responseText = await response.text();
      let result: any = null;
      try {
        result = JSON.parse(responseText);
      } catch (parseErr) {
        console.warn("Response from formsubmit was not valid JSON:", responseText);
        result = { raw: responseText };
      }

      if (!response.ok) {
        return res.status(response.status).json({
          error: (result && result.message) || "Form delivery network returned error status."
        });
      }

      // If FormSubmit specifically returns success: false, send message to client
      if (result && result.success === "false") {
        return res.status(400).json({
          error: result.message || "Form submission failed."
        });
      }

      res.json({ success: true, result });
    } catch (e: any) {
      console.error("Secure Contact Integration Error:", e);
      res.status(500).json({ error: e.message || "Failed to securely deliver your submission. Please try again later." });
    }
  });

  // Serving web application static assets or linking Vite in dev environment
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
    console.log(`PureTool Server listening on port ${PORT}`);
  });
}

startServer();
