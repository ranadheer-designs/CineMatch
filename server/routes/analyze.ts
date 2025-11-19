import { RequestHandler } from "express";
import { CinematographyAnalysis, AnalysisResponse } from "@shared/api";

interface GoogleGenerativeAIResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const handleAnalyzeShot: RequestHandler = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ error: "imageUrl is required" });
      return;
    }

    // Fetch image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    const prompt = `Analyze this cinematography shot in detail. Provide a JSON response with:

{
  "lighting": {
    "type": "three-point / natural / low-key / high-key",
    "keyLight": { "position": "description", "intensity": "soft/medium/hard", "color": "warm/neutral/cool" },
    "fillLight": { "position": "description", "intensity": "ratio to key" },
    "backLight": { "position": "description", "purpose": "description" },
    "practicals": ["list any visible practical lights"],
    "mood": "description"
  },
  "camera": {
    "focalLength": "estimated mm",
    "aperture": "estimated f-stop",
    "iso": "estimated ISO range",
    "shutterSpeed": "estimated",
    "movement": "static/pan/tilt/dolly/handheld/steadicam",
    "height": "eye-level/low-angle/high-angle/dutch"
  },
  "composition": {
    "ruleOfThirds": "yes/no with explanation",
    "leadingLines": "description if present",
    "symmetry": "symmetrical/asymmetrical",
    "depth": "shallow/medium/deep with foreground/midground/background elements",
    "headroom": "appropriate/tight/excessive",
    "lookingRoom": "description"
  },
  "colorGrading": {
    "palette": "description of color scheme",
    "contrast": "low/medium/high",
    "saturation": "desaturated/natural/vibrant/oversaturated",
    "temperature": "warm/neutral/cool with Kelvin estimate",
    "style": "description (e.g., teal and orange, vintage, cinematic, etc.)",
    "lut": "suggested LUT pack or style"
  },
  "mood": "overall emotional tone",
  "genre": "film genre this suits",
  "references": ["similar movies/cinematographers"]
}

Return ONLY valid JSON, no markdown code blocks.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      return;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inlineData: {
                    mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error:", error);

      const errorMessage =
        error.error?.message ||
        error.message ||
        "Failed to analyze image";

      res.status(response.status).json({
        error: "Failed to analyze image",
        details: {
          message: errorMessage,
          status: error.error?.status || response.status,
        },
      });
      return;
    }

    const data = (await response.json()) as GoogleGenerativeAIResponse;
    const analysisText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    const analysis: CinematographyAnalysis = JSON.parse(analysisText);

    const result: AnalysisResponse = {
      id: Date.now().toString(),
      analysis,
      imageUrl,
    };

    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: "Analysis failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
