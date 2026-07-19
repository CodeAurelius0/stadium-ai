import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/gemini";
import { EMERGENCY_ASSESSMENT_PROMPT } from "@/lib/ai/prompts";
import { incidentSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const parsed = incidentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { type, title, description, location } = parsed.data;

    // Generate AI assessment
    const prompt = `Incident Report:
Type: ${type}
Title: ${title}
Description: ${description}
Location: ${location || "Unspecified"}
Stadium: MetLife Stadium
Match Phase: First Half, 42nd minute
Current Occupancy: 67,423 / 82,500

Assess this incident and provide response recommendations.`;

    const aiAssessment = await generateAIResponse(prompt, EMERGENCY_ASSESSMENT_PROMPT);

    return NextResponse.json({
      id: `INC-${Date.now()}`,
      ...parsed.data,
      aiAssessment,
      status: "REPORTED",
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Incident creation error:", error);
    return NextResponse.json(
      { error: "Failed to process incident" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    activeIncidents: 7,
    criticalCount: 2,
    avgResponseTime: "3.2 min",
    resolvedToday: 14,
  });
}
