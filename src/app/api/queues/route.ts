import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/gemini";
import { QUEUE_PREDICTION_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendors, matchPhase } = body;

    const vendorSummary = vendors
      ?.map(
        (v: { name: string; currentWait: number; queueLength: number; category: string }) =>
          `${v.name} (${v.category}): Wait ${v.currentWait}min, Queue: ${v.queueLength} people`
      )
      .join("\n") || "No vendor data";

    const prompt = `Current queue data:\n${vendorSummary}\n\nMatch Phase: ${matchPhase || "FIRST_HALF"}\nTime: 42nd minute\nStadium Occupancy: 82%\n\nProvide queue predictions and recommendations for fans.`;

    const recommendation = await generateAIResponse(prompt, QUEUE_PREDICTION_PROMPT);

    return NextResponse.json({
      recommendation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Queue prediction error:", error);
    return NextResponse.json(
      { error: "Failed to generate queue predictions" },
      { status: 500 }
    );
  }
}
