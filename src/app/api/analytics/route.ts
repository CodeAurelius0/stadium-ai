import { NextResponse } from "next/server";

export async function GET() {
  // Return analytics/dashboard data
  return NextResponse.json({
    stadium: {
      name: "MetLife Stadium",
      capacity: 82500,
      currentOccupancy: 67423,
      occupancyPercent: 81.7,
    },
    match: {
      homeTeam: "Brazil",
      awayTeam: "Germany",
      score: "2 - 1",
      phase: "FIRST_HALF",
      minute: 42,
    },
    metrics: {
      activeIncidents: 7,
      criticalIncidents: 2,
      avgQueueWait: 8,
      staffOnDuty: 342,
      staffCoverage: 96,
      aiAlerts: 12,
      flowRate: 1240,
      temperature: 28,
      securityLevel: "NORMAL",
    },
    crowdRisk: {
      overall: "MEDIUM",
      highRiskZones: 3,
      predictedPeak: "Halftime (50th minute)",
    },
    timestamp: new Date().toISOString(),
  });
}
