import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/gemini";
import { TRANSLATION_PROMPT } from "@/lib/ai/prompts";
import { translateSchema } from "@/lib/validations";
import { LANGUAGES } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const parsed = translateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { text, sourceLanguage, targetLanguage } = parsed.data;

    const sourceName = LANGUAGES.find((l) => l.code === sourceLanguage)?.name || sourceLanguage;
    const targetName = LANGUAGES.find((l) => l.code === targetLanguage)?.name || targetLanguage;

    const systemPrompt = TRANSLATION_PROMPT
      .replace("{sourceLanguage}", sourceName)
      .replace("{targetLanguage}", targetName);

    const prompt = `Translate the following text:\n\n"${text}"`;

    const response = await generateAIResponse(prompt, systemPrompt);

    // Try to parse as JSON
    try {
      const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      // If not JSON, return as plain translation
      return NextResponse.json({
        translation: response.trim(),
        pronunciation: "",
        culturalNote: "",
        alternatives: [],
      });
    }
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
