interface Env {
  GEMINI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    
    // Parse JSON request
    const body: any = await request.json();
    const { text, tool, option } = body;

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required for AI processing." }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: "Gemini API key is not configured on Cloudflare. Please set GEMINI_API_KEY in the Cloudflare Pages settings under Environment Variables." 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

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
        systemInstruction = "You are an ingenious brainstorming and strategy companion. Analyze the input, then produce a highly creative, actionable list of alternative directions, content ideas, growth suggestions, or structural outlines. Make the suggestions clear, numbered, and well-structured.";
        prompt = `Generate brainstorming directions for the input content:\n\n${text}`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid tool specified." }),
          { 
            status: 400, 
            headers: { "Content-Type": "application/json" } 
          }
        );
    }

    // Call the Gemini API via Cloudflare edge-compatible fetch
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const apiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!apiResponse.ok) {
      const errorData: any = await apiResponse.json();
      return new Response(
        JSON.stringify({ error: errorData.error?.message || "Error calling Gemini API on the edge server." }),
        { 
          status: apiResponse.status, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    const data: any = await apiResponse.json();
    const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(
      JSON.stringify({ output: outputText }),
      { 
        headers: { "Content-Type": "application/json" } 
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "An internal error occurred." }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
};
