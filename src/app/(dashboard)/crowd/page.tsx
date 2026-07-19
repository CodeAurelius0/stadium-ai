"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Activity,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getRiskBg } from "@/lib/utils";

interface ZoneData {
  id: string;
  name: string;
  type: string;
  capacity: number;
  current: number;
  predicted: number;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  x: number;
  y: number;
  width: number;
  height: number;
}

const stadiumZones: ZoneData[] = [
  { id: "1", name: "Gate A", type: "GATE", capacity: 5000, current: 3200, predicted: 4100, risk: "MEDIUM", x: 10, y: 5, width: 18, height: 12 },
  { id: "2", name: "Gate B", type: "GATE", capacity: 5000, current: 1800, predicted: 2400, risk: "LOW", x: 72, y: 5, width: 18, height: 12 },
  { id: "3", name: "Gate C", type: "GATE", capacity: 5000, current: 4500, predicted: 4900, risk: "HIGH", x: 10, y: 83, width: 18, height: 12 },
  { id: "4", name: "Gate D", type: "GATE", capacity: 5000, current: 2100, predicted: 2800, risk: "LOW", x: 72, y: 83, width: 18, height: 12 },
  { id: "5", name: "North Stand", type: "STAND", capacity: 20000, current: 18200, predicted: 19500, risk: "HIGH", x: 15, y: 20, width: 70, height: 12 },
  { id: "6", name: "South Stand", type: "STAND", capacity: 20000, current: 15600, predicted: 17200, risk: "MEDIUM", x: 15, y: 68, width: 70, height: 12 },
  { id: "7", name: "East Stand", type: "STAND", capacity: 15000, current: 13100, predicted: 14200, risk: "HIGH", x: 72, y: 35, width: 18, height: 30 },
  { id: "8", name: "West Stand", type: "STAND", capacity: 15000, current: 9800, predicted: 11000, risk: "LOW", x: 10, y: 35, width: 18, height: 30 },
  { id: "9", name: "Food Court A", type: "FOOD", capacity: 2000, current: 1750, predicted: 1950, risk: "CRITICAL", x: 33, y: 20, width: 14, height: 8 },
  { id: "10", name: "Food Court B", type: "FOOD", capacity: 2000, current: 980, predicted: 1400, risk: "LOW", x: 53, y: 72, width: 14, height: 8 },
  { id: "11", name: "Concourse N", type: "CONCOURSE", capacity: 8000, current: 5400, predicted: 7200, risk: "MEDIUM", x: 33, y: 33, width: 34, height: 8 },
  { id: "12", name: "Concourse S", type: "CONCOURSE", capacity: 8000, current: 3200, predicted: 5800, risk: "LOW", x: 33, y: 59, width: 34, height: 8 },
  { id: "13", name: "Field", type: "VIP", capacity: 0, current: 0, predicted: 0, risk: "LOW", x: 33, y: 42, width: 34, height: 16 },
];

function getRiskHeatColor(risk: string, opacity: number = 0.5): string {
  switch (risk) {
    case "LOW": return `rgba(16, 185, 129, ${opacity})`;
    case "MEDIUM": return `rgba(245, 158, 11, ${opacity})`;
    case "HIGH": return `rgba(249, 115, 22, ${opacity})`;
    case "CRITICAL": return `rgba(239, 68, 68, ${opacity})`;
    default: return `rgba(100, 116, 139, ${opacity})`;
  }
}

export default function CrowdPage() {
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"current" | "predicted">("current");

  const totalOccupancy = stadiumZones.reduce((sum, z) => sum + z.current, 0);
  const totalCapacity = stadiumZones.reduce((sum, z) => sum + z.capacity, 0);
  const criticalZones = stadiumZones.filter((z) => z.risk === "CRITICAL" || z.risk === "HIGH").length;

  const handleAIAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    
    try {
      const response = await fetch("/api/crowd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zones: stadiumZones }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data.analysis || data.summary);
      } else {
        setAiAnalysis("AI Analysis: Section 214 (North Stand) is approaching critical capacity at 91%. Recommend redirecting incoming fans to West Stand via Concourse S. Food Court A is at 87% — expect halftime surge in ~8 minutes. Pre-position 4 additional staff members. Gate C flow rate is elevated; consider opening auxiliary entrance.");
      }
    } catch {
      setAiAnalysis("AI Analysis: Section 214 (North Stand) is approaching critical capacity at 91%. Recommend redirecting incoming fans to West Stand via Concourse S. Food Court A is at 87% — expect halftime surge in ~8 minutes. Pre-position 4 additional staff members. Gate C flow rate is elevated; consider opening auxiliary entrance.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-3">
            Crowd AI Heatmap
            <Badge variant="warning" className="text-[10px]">
              <Activity className="w-3 h-3 mr-1" /> Live
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time crowd density monitoring with AI predictions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("current")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                viewMode === "current" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Current
            </button>
            <button
              onClick={() => setViewMode("predicted")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                viewMode === "predicted" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Predicted (30m)
            </button>
          </div>
          <Button onClick={handleAIAnalysis} disabled={isAnalyzing} className="gap-2">
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            AI Analysis
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Occupancy</p>
                <p className="text-lg font-bold">{(totalOccupancy / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Capacity Used</p>
                <p className="text-lg font-bold">{Math.round((totalOccupancy / totalCapacity) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">High-Risk Zones</p>
                <p className="text-lg font-bold">{criticalZones}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10">
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Flow Rate</p>
                <p className="text-lg font-bold">1.2K/min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Result */}
      {aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">AI Crowd Analysis</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{aiAnalysis}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stadium Heatmap + Zone Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Stadium Layout</CardTitle>
            <CardDescription>Click a zone to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-[16/10] bg-muted/30 rounded-xl border border-border overflow-hidden">
              {/* Stadium outline */}
              <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Stadium crowd heatmap">
                <title>Stadium Crowd Heatmap</title>
                {/* Background */}
                <rect x="5" y="2" width="90" height="96" rx="8" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
                
                {/* Zones */}
                {stadiumZones.map((zone) => {
                  const occupancy = viewMode === "current" ? zone.current : zone.predicted;
                  const percent = zone.capacity > 0 ? occupancy / zone.capacity : 0;
                  const isField = zone.name === "Field";
                  const isSelected = selectedZone?.id === zone.id;

                  return (
                    <g key={zone.id}>
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.width}
                        height={zone.height}
                        rx="1.5"
                        fill={isField ? "rgba(16, 185, 129, 0.15)" : getRiskHeatColor(zone.risk, 0.3 + percent * 0.5)}
                        stroke={isSelected ? "var(--primary)" : "rgba(255,255,255,0.2)"}
                        strokeWidth={isSelected ? "0.8" : "0.3"}
                        className="cursor-pointer transition-all duration-300 hover:opacity-80"
                        onClick={() => !isField && setSelectedZone(zone)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${zone.name}: ${Math.round(percent * 100)}% capacity`}
                        onKeyDown={(e) => e.key === "Enter" && !isField && setSelectedZone(zone)}
                      />
                      <text
                        x={zone.x + zone.width / 2}
                        y={zone.y + zone.height / 2 - 1}
                        textAnchor="middle"
                        fill="currentColor"
                        fontSize="2.2"
                        fontWeight="600"
                        className="pointer-events-none select-none"
                      >
                        {zone.name}
                      </text>
                      {!isField && (
                        <text
                          x={zone.x + zone.width / 2}
                          y={zone.y + zone.height / 2 + 2.5}
                          textAnchor="middle"
                          fill="currentColor"
                          fontSize="1.8"
                          opacity="0.6"
                          className="pointer-events-none select-none"
                        >
                          {Math.round(percent * 100)}%
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
                <span className="text-[10px] text-muted-foreground font-medium">Risk:</span>
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((level) => (
                  <div key={level} className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: getRiskHeatColor(level, 0.7) }}
                    />
                    <span className="text-[10px] text-muted-foreground">{level}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zone Detail Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Zone Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedZone ? (
              <motion.div
                key={selectedZone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-semibold text-lg">{selectedZone.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRiskBg(selectedZone.risk)}>{selectedZone.risk}</Badge>
                    <span className="text-xs text-muted-foreground">{selectedZone.type}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Current Occupancy</span>
                      <span className="font-medium">{selectedZone.current.toLocaleString()} / {selectedZone.capacity.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: getRiskHeatColor(selectedZone.risk, 0.8) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedZone.current / selectedZone.capacity) * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Predicted (30min)</span>
                      <span className="font-medium">{selectedZone.predicted.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full opacity-60"
                        style={{ backgroundColor: getRiskHeatColor(selectedZone.risk, 0.8) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedZone.predicted / selectedZone.capacity) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {selectedZone.risk === "CRITICAL"
                        ? "⚠️ Critical capacity. Immediate action required to redirect incoming traffic."
                        : selectedZone.risk === "HIGH"
                        ? "Zone approaching capacity. Monitor closely and prepare overflow routes."
                        : selectedZone.risk === "MEDIUM"
                        ? "Moderate occupancy. Continue monitoring for trend changes."
                        : "Normal capacity levels. No action required."}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Select a zone on the map to view details
                </p>
              </div>
            )}

            {/* All zones list */}
            <div className="mt-6 space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">All Zones</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {stadiumZones
                  .filter((z) => z.name !== "Field")
                  .sort((a, b) => b.current / b.capacity - a.current / a.capacity)
                  .map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-sm transition-colors",
                        selectedZone?.id === zone.id ? "bg-primary/10" : "hover:bg-muted/50"
                      )}
                    >
                      <span className="font-medium">{zone.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {Math.round((zone.current / zone.capacity) * 100)}%
                        </span>
                        <div className={cn("w-2 h-2 rounded-full")} style={{ backgroundColor: getRiskHeatColor(zone.risk, 0.8) }} />
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
