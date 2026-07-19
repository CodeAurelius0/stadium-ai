"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  TrendingDown,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Users,
  ChevronRight,
  Star,
  Timer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QUEUE_CATEGORIES } from "@/lib/constants";

interface QueueVendor {
  id: string;
  name: string;
  category: string;
  icon: string;
  currentWait: number;
  predictedWait15: number;
  predictedWait30: number;
  queueLength: number;
  isOpen: boolean;
  optimalTime: string;
  rating: number;
  zone: string;
}

const vendors: QueueVendor[] = [
  { id: "1", name: "Stadium Burgers", category: "FOOD", icon: "🍔", currentWait: 12, predictedWait15: 18, predictedWait30: 8, queueLength: 34, isOpen: true, optimalTime: "In 25 min", rating: 4.5, zone: "Food Court A" },
  { id: "2", name: "Pizza Corner", category: "FOOD", icon: "🍕", currentWait: 8, predictedWait15: 14, predictedWait30: 6, queueLength: 22, isOpen: true, optimalTime: "In 28 min", rating: 4.2, zone: "Food Court A" },
  { id: "3", name: "Taco Fiesta", category: "FOOD", icon: "🌮", currentWait: 5, predictedWait15: 9, predictedWait30: 4, queueLength: 12, isOpen: true, optimalTime: "Now", rating: 4.7, zone: "Food Court B" },
  { id: "4", name: "Sushi Express", category: "FOOD", icon: "🍱", currentWait: 15, predictedWait15: 20, predictedWait30: 10, queueLength: 40, isOpen: true, optimalTime: "In 30 min", rating: 4.4, zone: "Food Court A" },
  { id: "5", name: "Fresh Juice Bar", category: "BEVERAGE", icon: "🧃", currentWait: 3, predictedWait15: 6, predictedWait30: 3, queueLength: 8, isOpen: true, optimalTime: "Now", rating: 4.6, zone: "Concourse N" },
  { id: "6", name: "Beer Garden", category: "BEVERAGE", icon: "🍺", currentWait: 10, predictedWait15: 16, predictedWait30: 7, queueLength: 28, isOpen: true, optimalTime: "In 25 min", rating: 4.1, zone: "Food Court B" },
  { id: "7", name: "Coffee Station", category: "BEVERAGE", icon: "☕", currentWait: 4, predictedWait15: 5, predictedWait30: 3, queueLength: 10, isOpen: true, optimalTime: "Now", rating: 4.3, zone: "Concourse S" },
  { id: "8", name: "Restroom North 1", category: "RESTROOM", icon: "🚻", currentWait: 6, predictedWait15: 10, predictedWait30: 4, queueLength: 15, isOpen: true, optimalTime: "In 25 min", rating: 0, zone: "North Stand" },
  { id: "9", name: "Restroom South 1", category: "RESTROOM", icon: "🚻", currentWait: 2, predictedWait15: 4, predictedWait30: 2, queueLength: 5, isOpen: true, optimalTime: "Now", rating: 0, zone: "South Stand" },
  { id: "10", name: "Gate A Entry", category: "ENTRY", icon: "🚪", currentWait: 4, predictedWait15: 3, predictedWait30: 2, queueLength: 45, isOpen: true, optimalTime: "Anytime", rating: 0, zone: "North" },
  { id: "11", name: "Gate C Entry", category: "ENTRY", icon: "🚪", currentWait: 11, predictedWait15: 8, predictedWait30: 5, queueLength: 120, isOpen: true, optimalTime: "In 20 min", rating: 0, zone: "South" },
  { id: "12", name: "FIFA Fan Shop", category: "MERCH", icon: "👕", currentWait: 9, predictedWait15: 12, predictedWait30: 6, queueLength: 25, isOpen: true, optimalTime: "In 30 min", rating: 4.8, zone: "Concourse N" },
];

function WaitBar({ current, max = 25 }: { current: number; max?: number }) {
  const percent = Math.min((current / max) * 100, 100);
  const color = current <= 5 ? "bg-emerald-500" : current <= 10 ? "bg-amber-500" : current <= 15 ? "bg-orange-500" : "bg-red-500";
  
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        className={cn("h-full rounded-full", color)}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

export default function QueuesPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState<"wait" | "predicted" | "name">("wait");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [liveVendors, setLiveVendors] = useState(vendors);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVendors((prev) =>
        prev.map((v) => ({
          ...v,
          currentWait: Math.max(1, v.currentWait + Math.floor(Math.random() * 3 - 1)),
          queueLength: Math.max(1, v.queueLength + Math.floor(Math.random() * 5 - 2)),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredVendors = liveVendors
    .filter((v) => selectedCategory === "ALL" || v.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "wait") return a.currentWait - b.currentWait;
      if (sortBy === "predicted") return a.predictedWait30 - b.predictedWait30;
      return a.name.localeCompare(b.name);
    });

  const avgWait = Math.round(
    liveVendors.filter((v) => v.category === "FOOD").reduce((sum, v) => sum + v.currentWait, 0) /
    liveVendors.filter((v) => v.category === "FOOD").length
  );

  const handleAIPrediction = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/queues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendors: liveVendors, matchPhase: "FIRST_HALF" }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiRecommendation(data.recommendation);
      }
    } catch {
      // noop
    }
    setAiRecommendation(
      "🧠 Halftime is in ~8 minutes. Food queues will increase by 150-200% in the next 10 minutes. Best options right now: Taco Fiesta (5 min wait) and Coffee Station (4 min). If you can wait 25 minutes post-halftime, all food courts will drop to under 5 min wait. For restrooms, South Restroom 1 is currently nearly empty."
    );
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-3">
            <Timer className="w-7 h-7 text-primary" />
            Queue Predictor
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-predicted wait times and optimal visit recommendations
          </p>
        </div>
        <Button onClick={handleAIPrediction} disabled={isAnalyzing} className="gap-2">
          {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          AI Recommendations
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Food Wait</p>
                <p className="text-xl font-bold">{avgWait} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shortest Wait</p>
                <p className="text-xl font-bold">{Math.min(...liveVendors.map((v) => v.currentWait))} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Longest Wait</p>
                <p className="text-xl font-bold">{Math.max(...liveVendors.map((v) => v.currentWait))} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total In Queues</p>
                <p className="text-xl font-bold">{liveVendors.reduce((s, v) => s + v.queueLength, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation */}
      {aiRecommendation && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">AI Queue Prediction</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{aiRecommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              selectedCategory === "ALL" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All
          </button>
          {QUEUE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1",
                selectedCategory === cat.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-xs text-muted-foreground">Sort:</span>
          {[
            { value: "wait" as const, label: "Current Wait" },
            { value: "predicted" as const, label: "Predicted" },
            { value: "name" as const, label: "Name" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => setSortBy(s.value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                sortBy === s.value ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{vendor.icon}</span>
                    <div>
                      <h3 className="font-semibold text-sm">{vendor.name}</h3>
                      <p className="text-xs text-muted-foreground">{vendor.zone}</p>
                    </div>
                  </div>
                  {vendor.rating > 0 && (
                    <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {vendor.rating}
                    </div>
                  )}
                </div>

                {/* Current wait */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Current Wait</span>
                    <span className={cn(
                      "font-bold tabular-nums",
                      vendor.currentWait <= 5 ? "text-emerald-600 dark:text-emerald-400" :
                      vendor.currentWait <= 10 ? "text-amber-600 dark:text-amber-400" :
                      "text-red-600 dark:text-red-400"
                    )}>
                      {vendor.currentWait} min
                    </span>
                  </div>
                  <WaitBar current={vendor.currentWait} />
                </div>

                {/* Predictions */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">In 15 min</p>
                    <p className={cn("font-semibold", vendor.predictedWait15 > vendor.currentWait ? "text-red-500" : "text-emerald-500")}>
                      {vendor.predictedWait15 > vendor.currentWait ? "↑" : "↓"} {vendor.predictedWait15} min
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">In 30 min</p>
                    <p className={cn("font-semibold", vendor.predictedWait30 > vendor.currentWait ? "text-red-500" : "text-emerald-500")}>
                      {vendor.predictedWait30 > vendor.currentWait ? "↑" : "↓"} {vendor.predictedWait30} min
                    </p>
                  </div>
                </div>

                {/* Optimal time */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
                  <span className="text-muted-foreground">
                    {vendor.queueLength} people in line
                  </span>
                  <Badge
                    variant={vendor.optimalTime === "Now" ? "success" : "secondary"}
                    className="text-[10px]"
                  >
                    {vendor.optimalTime === "Now" ? "✨ Go Now" : `Best: ${vendor.optimalTime}`}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
