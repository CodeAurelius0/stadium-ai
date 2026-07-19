import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

export function getGeminiModel(modelName: string = "gemini-2.0-flash") {
  return genAI.getGenerativeModel({
    model: modelName,
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });
}

export async function generateAIResponse(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const model = getGeminiModel();
    
    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\n${prompt}`
      : prompt;
    
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate AI response. Please check your API key.");
  }
}

export async function generateStructuredResponse<T>(
  prompt: string,
  systemPrompt: string,
): Promise<T> {
  const fullSystem = `${systemPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanations. Just the JSON object.`;
  
  const text = await generateAIResponse(prompt, fullSystem);
  
  // Clean up potential markdown wrapping
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    console.error("Failed to parse AI response as JSON:", cleaned);
    throw new Error("AI returned invalid JSON response");
  }
}

export { genAI };
