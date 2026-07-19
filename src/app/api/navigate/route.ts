import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/gemini";
import { ROUTE_OPTIMIZATION_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, mode } = body;

    if (!from || !to) {
      return NextResponse.json(
        { error: "Both 'from' and 'to' locations are required" },
        { status: 400 }
      );
    }

    const prompt = `Navigate from "${from}" to "${to}" in MetLife Stadium.
Route preference: ${mode || "fastest"}
Current crowd levels:
- Concourse N: 68% (MEDIUM)
- Concourse S: 40% (LOW)
- Food Court A: 87% (HIGH)
- Food Court B: 49% (LOW)

Provide step-by-step directions.`;

    const response = await generateAIResponse(prompt, ROUTE_OPTIMIZATION_PROMPT);

    // Try parse JSON
    try {
      const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        route: [
          { step: 1, instruction: `Start at ${from}`, zone: from, estimatedTime: "0 sec", crowdLevel: "LOW" },
          { step: 2, instruction: `Navigate to ${to}`, zone: "Concourse", estimatedTime: "2 min", crowdLevel: "MEDIUM" },
          { step: 3, instruction: `Arrive at ${to}`, zone: to, estimatedTime: "30 sec", crowdLevel: "LOW" },
        ],
        totalTime: "2.5 min",
      });
    }
  } catch (error) {
    console.error("Navigation error:", error);
    return NextResponse.json(
      { error: "Failed to compute route" },
      { status: 500 }
    );
  }
}
