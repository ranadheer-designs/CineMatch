import { RequestHandler } from "express";
import { CinematographyAnalysis, GuideResponse } from "@shared/api";

interface GoogleGenerativeAIResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const handleGenerateGuide: RequestHandler = async (req, res) => {
  try {
    const { analysis, apiKey, userEquipment = "basic DSLR setup" } = req.body;

    if (!analysis) {
      res.status(400).json({ error: "analysis is required" });
      return;
    }

    if (!apiKey) {
      res.status(400).json({ error: "apiKey is required" });
      return;
    }

    const prompt = `Based on this cinematography analysis:
${JSON.stringify(analysis, null, 2)}

User has: ${userEquipment}

Create a detailed, step-by-step recreation guide with:

# Recreation Guide

## Step 1: Camera Setup
- Exact camera settings (list aperture, ISO, shutter speed recommendations)
- Lens recommendation with focal length
- Alternative options for budget setups
- Settings summary

## Step 2: Lighting Setup
- Key light: position, type, modifier, distance, intensity
- Fill light: details and positioning
- Back light: details and purpose if applicable
- Any practical lights to use
- DIY alternatives for expensive equipment
- Quick lighting checklist

## Step 3: Composition & Framing
- How to position camera (height, distance, angle)
- Where to place subject or main action
- What to include in frame for depth
- Grid overlay suggestions (rule of thirds application)

## Step 4: Color Grading
- In-camera settings (picture profile if applicable)
- Recommended LUTs or manual adjustments
- Free alternatives to expensive plugins
- Step-by-step color correction in DaVinci Resolve (free)

## Step 5: Common Mistakes to Avoid
- List 5 pitfalls to avoid when recreating this look

## Budget Breakdown
- Professional setup: $X
- Intermediate setup: $Y
- Budget/DIY setup: $Z with specific equipment recommendations

## Pro Tips
- 3-5 professional tips for nailing this look
- Common challenges and how to overcome them

Format as markdown with clear headers. Be practical and specific.`;

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
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error:", error);
      res.status(500).json({
        error: "Failed to generate guide",
        details: error,
      });
      return;
    }

    const data = (await response.json()) as GoogleGenerativeAIResponse;
    const guide = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const result: GuideResponse = {
      guide,
    };

    res.json(result);
  } catch (error) {
    console.error("Guide generation error:", error);
    res.status(500).json({
      error: "Guide generation failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
