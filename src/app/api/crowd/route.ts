import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/gemini";
import { CROWD_ANALYSIS_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zones } = body;

    if (!zones || !Array.isArray(zones)) {
      return NextResponse.json(
        { error: "Invalid request: zones array required" },
        { status: 400 }
      );
    }

    const zonesSummary = zones
      .map(
        (z: { name: string; current: number; capacity: number; risk: string }) =>
          `${z.name}: ${z.current}/${z.capacity} (${Math.round((z.current / z.capacity) * 100)}%) - Risk: ${z.risk}`
      )
      .join("\n");

    const prompt = `Current stadium zone data:\n${zonesSummary}\n\nMatch Phase: First Half, 42nd minute\nWeather: 28°C, Clear\n\nProvide a crowd management analysis.`;

    const analysis = await generateAIResponse(prompt, CROWD_ANALYSIS_PROMPT);

    return NextResponse.json({
      analysis,
      summary: analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Crowd analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate crowd analysis" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return current crowd data (demo)
  return NextResponse.json({
    totalOccupancy: 67423,
    totalCapacity: 82500,
    overallRisk: "MEDIUM",
    timestamp: new Date().toISOString(),
  });
}
