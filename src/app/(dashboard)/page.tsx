"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  AlertTriangle,
  Clock,
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  MapPin,
  ThermometerSun,
  Eye,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, formatNumber, timeAgo } from "@/lib/utils";
import { useAppStore } from "@/stores";
import { DEMO_STADIUMS } from "@/lib/constants";

// Animated counter component
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{formatNumber(count)}</span>;
}

// Match countdown
function MatchCountdown() {
  const [time, setTime] = useState({ hours: 0, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds + 1;
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1 font-mono text-2xl font-bold tabular-nums">
      <span className="bg-primary/10 rounded-lg px-2 py-1">{String(time.hours).padStart(2, "0")}</span>
      <span className="text-muted-foreground animate-pulse">:</span>
      <span className="bg-primary/10 rounded-lg px-2 py-1">{String(time.minutes).padStart(2, "0")}</span>
      <span className="text-muted-foreground animate-pulse">:</span>
      <span className="bg-primary/10 rounded-lg px-2 py-1">{String(time.seconds).padStart(2, "0")}</span>
    </div>
  );
}

// Metric card
interface MetricCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  color: string;
  delay?: number;
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, color, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
        <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -translate-y-8 translate-x-8 transition-transform group-hover:scale-125", color)} />
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {title}
              </p>
              <p className="text-3xl font-bold tracking-tight">
                <AnimatedCounter value={value} />
              </p>
              <div className="flex items-center gap-2">
                {trend && (
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {trend.value}%
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{subtitle}</span>
              </div>
            </div>
            <div className={cn("flex items-center justify-center w-11 h-11 rounded-xl", color)}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Recent incidents
const recentIncidents = [
  {
    id: "1",
    title: "Medical assistance needed at Section 108",
    type: "MEDICAL",
    severity: "HIGH",
    status: "IN_PROGRESS",
    time: new Date(Date.now() - 180000),
    icon: "🏥",
  },
  {
    id: "2",
    title: "Crowd congestion at Gate C entrance",
    type: "CROWD",
    severity: "MEDIUM",
    status: "ASSIGNED",
    time: new Date(Date.now() - 600000),
    icon: "👥",
  },
  {
    id: "3",
    title: "Spill cleanup needed at Food Court B",
    type: "OTHER",
    severity: "LOW",
    status: "REPORTED",
    time: new Date(Date.now() - 900000),
    icon: "📋",
  },
  {
    id: "4",
    title: "Suspicious package reported at Gate A",
    type: "SECURITY",
    severity: "HIGH",
    status: "IN_PROGRESS",
    time: new Date(Date.now() - 1200000),
    icon: "🔒",
  },
];

// AI insights
const aiInsights = [
  {
    id: "1",
    message: "Section 214 will reach 95% capacity in ~12 minutes. Recommend opening overflow to Section 218.",
    type: "warning" as const,
    confidence: 94,
  },
  {
    id: "2",
    message: "Halftime rush predicted in 8 minutes. Pre-position staff at Food Courts A & C.",
    type: "info" as const,
    confidence: 89,
  },
  {
    id: "3",
    message: "Exit Gate D flow rate is 15% below optimal. Possible obstruction detected.",
    type: "warning" as const,
    confidence: 87,
  },
  {
    id: "4",
    message: "Weather alert: Temperature rising to 34°C. Increase hydration station staffing.",
    type: "info" as const,
    confidence: 92,
  },
];

// Quick actions
const quickActions = [
  { label: "Report Incident", href: "/emergency", icon: AlertTriangle, color: "bg-red-500" },
  { label: "View Crowd Map", href: "/crowd", icon: Eye, color: "bg-blue-500" },
  { label: "Navigate", href: "/navigate", icon: MapPin, color: "bg-emerald-500" },
  { label: "Check Queues", href: "/queues", icon: Clock, color: "bg-purple-500" },
];

export default function CommandCenterPage() {
  const { selectedStadiumId } = useAppStore();
  const stadium = DEMO_STADIUMS.find((s) => s.id === selectedStadiumId) || DEMO_STADIUMS[0];
  const [liveOccupancy, setLiveOccupancy] = useState(67423);

  // Simulate live occupancy updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOccupancy((prev) => prev + Math.floor(Math.random() * 20 - 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const occupancyPercent = Math.round((liveOccupancy / stadium.capacity) * 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time operations overview for {stadium.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
            <Activity className="w-3 h-3 text-emerald-500" />
            1st Half — 42&apos;
          </Badge>
        </div>
      </div>

      {/* Match Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-primary/20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
            <CardContent className="p-5 relative">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Teams */}
                <div className="flex items-center gap-6 text-center">
                  <div className="space-y-1">
                    <div className="text-3xl">🇧🇷</div>
                    <p className="text-sm font-semibold">Brazil</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-3xl font-bold tabular-nums">2 — 1</p>
                    <p className="text-xs text-muted-foreground">Group A · Match 12</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl">🇩🇪</div>
                    <p className="text-sm font-semibold">Germany</p>
                  </div>
                </div>

                {/* Match Time */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Match Time</p>
                  <MatchCountdown />
                </div>

                {/* Occupancy */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">Stadium Occupancy</p>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold">{occupancyPercent}%</div>
                    <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full transition-colors duration-500",
                          occupancyPercent > 90
                            ? "bg-red-500"
                            : occupancyPercent > 75
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${occupancyPercent}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {formatNumber(liveOccupancy)} / {formatNumber(stadium.capacity)}
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Incidents"
          value={7}
          subtitle="2 critical"
          icon={AlertTriangle}
          trend={{ value: 12, positive: false }}
          color="bg-red-500"
          delay={0.1}
        />
        <MetricCard
          title="Avg Queue Wait"
          value={8}
          subtitle="minutes"
          icon={Clock}
          trend={{ value: 18, positive: true }}
          color="bg-purple-500"
          delay={0.2}
        />
        <MetricCard
          title="Staff On Duty"
          value={342}
          subtitle="96% coverage"
          icon={Shield}
          trend={{ value: 4, positive: true }}
          color="bg-blue-500"
          delay={0.3}
        />
        <MetricCard
          title="AI Alerts"
          value={12}
          subtitle="today"
          icon={Zap}
          trend={{ value: 8, positive: true }}
          color="bg-amber-500"
          delay={0.4}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
          >
            <Link href={action.href}>
              <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl text-white", action.color)}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Two-column layout: AI Insights + Incidents */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  AI Insights
                </CardTitle>
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Zap className="w-2.5 h-2.5" />
                  Gemini
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className={cn(
                    "flex gap-3 p-3 rounded-lg border transition-colors hover:bg-muted/50",
                    insight.type === "warning"
                      ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20"
                      : "border-border bg-background"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 w-2 h-2 rounded-full shrink-0",
                      insight.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">{insight.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Confidence: {insight.confidence}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Incidents */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  Recent Incidents
                </CardTitle>
                <Link href="/emergency">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentIncidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <span className="text-lg">{incident.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                      {incident.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          incident.severity === "HIGH" || incident.severity === "CRITICAL"
                            ? "danger"
                            : incident.severity === "MEDIUM"
                            ? "warning"
                            : "info"
                        }
                        className="text-[10px] px-1.5 py-0"
                      >
                        {incident.severity}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {timeAgo(incident.time)}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={incident.status === "IN_PROGRESS" ? "warning" : "secondary"}
                    className="text-[10px] shrink-0"
                  >
                    {incident.status.replace("_", " ")}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Live Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <ThermometerSun className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="text-sm font-semibold">28°C / 82°F</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Flow Rate</p>
                  <p className="text-sm font-semibold">1,240 / min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Security Level</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Normal</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">System Status</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">All Systems Go</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
