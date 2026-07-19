"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Map,
  Navigation,
  Search,
  Accessibility,
  Coffee,
  DoorOpen,
  Cross,
  ShoppingBag,
  MapPin,
  Route,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Locate,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface POI {
  id: string;
  name: string;
  category: string;
  icon: string;
  x: number;
  y: number;
  description: string;
  crowdLevel: "LOW" | "MEDIUM" | "HIGH";
  distance?: string;
}

const pois: POI[] = [
  { id: "1", name: "Gate A", category: "ENTRY", icon: "🚪", x: 15, y: 8, description: "Main entrance - North", crowdLevel: "MEDIUM" },
  { id: "2", name: "Gate B", category: "ENTRY", icon: "🚪", x: 78, y: 8, description: "East entrance", crowdLevel: "LOW" },
  { id: "3", name: "Gate C", category: "ENTRY", icon: "🚪", x: 15, y: 88, description: "South entrance", crowdLevel: "HIGH" },
  { id: "4", name: "Gate D", category: "ENTRY", icon: "🚪", x: 78, y: 88, description: "West entrance", crowdLevel: "LOW" },
  { id: "5", name: "Food Court A", category: "FOOD", icon: "🍔", x: 30, y: 22, description: "Burgers, Pizza, Drinks", crowdLevel: "HIGH", distance: "2 min" },
  { id: "6", name: "Food Court B", category: "FOOD", icon: "🍕", x: 65, y: 75, description: "Mexican, Asian, Desserts", crowdLevel: "LOW", distance: "5 min" },
  { id: "7", name: "Café Norte", category: "FOOD", icon: "☕", x: 45, y: 15, description: "Coffee, Pastries", crowdLevel: "MEDIUM", distance: "3 min" },
  { id: "8", name: "Restroom N1", category: "RESTROOM", icon: "🚻", x: 25, y: 35, description: "North restrooms", crowdLevel: "MEDIUM" },
  { id: "9", name: "Restroom S1", category: "RESTROOM", icon: "🚻", x: 70, y: 60, description: "South restrooms", crowdLevel: "LOW" },
  { id: "10", name: "Medical Station 1", category: "MEDICAL", icon: "🏥", x: 50, y: 30, description: "First aid, AED available", crowdLevel: "LOW" },
  { id: "11", name: "Medical Station 2", category: "MEDICAL", icon: "🏥", x: 35, y: 70, description: "First aid, Paramedic", crowdLevel: "LOW" },
  { id: "12", name: "Fan Shop", category: "SHOP", icon: "👕", x: 55, y: 20, description: "Official FIFA merchandise", crowdLevel: "HIGH", distance: "4 min" },
  { id: "13", name: "Info Desk", category: "INFO", icon: "ℹ️", x: 48, y: 50, description: "Information & assistance", crowdLevel: "LOW" },
  { id: "14", name: "Accessible Elevator 1", category: "ACCESSIBILITY", icon: "♿", x: 20, y: 50, description: "Elevator to all levels", crowdLevel: "LOW" },
  { id: "15", name: "Accessible Elevator 2", category: "ACCESSIBILITY", icon: "♿", x: 75, y: 50, description: "Elevator to all levels", crowdLevel: "LOW" },
  { id: "16", name: "Emergency Exit 1", category: "EXIT", icon: "🚨", x: 8, y: 50, description: "Emergency exit - West", crowdLevel: "LOW" },
  { id: "17", name: "Emergency Exit 2", category: "EXIT", icon: "🚨", x: 88, y: 50, description: "Emergency exit - East", crowdLevel: "LOW" },
];

const categories = [
  { value: "ALL", label: "All", icon: MapPin },
  { value: "FOOD", label: "Food", icon: Coffee },
  { value: "RESTROOM", label: "Restroom", icon: DoorOpen },
  { value: "MEDICAL", label: "Medical", icon: Cross },
  { value: "SHOP", label: "Shops", icon: ShoppingBag },
  { value: "ENTRY", label: "Gates", icon: DoorOpen },
  { value: "ACCESSIBILITY", label: "Accessible", icon: Accessibility },
];

interface RouteStep {
  step: number;
  instruction: string;
  zone: string;
  estimatedTime: string;
  crowdLevel: "LOW" | "MEDIUM" | "HIGH";
}

export default function NavigatePage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromLocation, setFromLocation] = useState("My Location (Section 214)");
  const [toLocation, setToLocation] = useState("");
  const [isRouting, setIsRouting] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteStep[] | null>(null);
  const [routeMode, setRouteMode] = useState<"fastest" | "least-crowded" | "accessible">("fastest");

  const filteredPOIs = pois.filter((poi) => {
    const matchesCategory = selectedCategory === "ALL" || poi.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const crowdColor = (level: string) => {
    switch (level) {
      case "LOW": return "bg-emerald-500";
      case "MEDIUM": return "bg-amber-500";
      case "HIGH": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleGetRoute = async () => {
    if (!toLocation) return;
    setIsRouting(true);
    setRouteResult(null);

    try {
      const res = await fetch("/api/navigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: fromLocation, to: toLocation, mode: routeMode }),
      });
      if (res.ok) {
        const data = await res.json();
        setRouteResult(data.route);
      }
    } catch {
      // Fallback demo route
    }

    // Fallback demo
    setRouteResult([
      { step: 1, instruction: `Exit ${fromLocation.replace("My Location (", "").replace(")", "")}`, zone: "North Stand", estimatedTime: "30 sec", crowdLevel: "MEDIUM" },
      { step: 2, instruction: "Walk through Concourse N heading East", zone: "Concourse N", estimatedTime: "1 min", crowdLevel: "MEDIUM" },
      { step: 3, instruction: "Take the stairs down to Level 1", zone: "Stairway C", estimatedTime: "30 sec", crowdLevel: "LOW" },
      { step: 4, instruction: `Arrive at ${toLocation}`, zone: toLocation, estimatedTime: "30 sec", crowdLevel: "LOW" },
    ]);
    setIsRouting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-3">
          <Map className="w-7 h-7 text-primary" />
          Smart Navigator
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered stadium navigation with crowd-aware routing
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Stadium Map</CardTitle>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Locate className="w-3.5 h-3.5" />
                  My Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Category filters */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                      selectedCategory === cat.value
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Interactive Map */}
              <div className="relative w-full aspect-[16/10] bg-muted/30 rounded-xl border border-border overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Stadium navigation map">
                  <title>Stadium Navigation Map</title>
                  {/* Stadium outline */}
                  <rect x="5" y="3" width="90" height="94" rx="6" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
                  
                  {/* Field */}
                  <rect x="30" y="38" width="40" height="24" rx="2" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="0.3" />
                  <text x="50" y="52" textAnchor="middle" fill="currentColor" fontSize="2.5" opacity="0.3" fontWeight="600">PITCH</text>

                  {/* Stands outlines */}
                  <rect x="12" y="15" width="76" height="18" rx="1.5" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.1" />
                  <rect x="12" y="67" width="76" height="18" rx="1.5" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.1" />

                  {/* User location indicator */}
                  <circle cx="42" cy="18" r="2" fill="rgb(59, 130, 246)" opacity="0.3">
                    <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="42" cy="18" r="1.2" fill="rgb(59, 130, 246)" />
                  <text x="42" y="13" textAnchor="middle" fill="rgb(59, 130, 246)" fontSize="1.8" fontWeight="600">You</text>

                  {/* Route path (if active) */}
                  {routeResult && (
                    <path
                      d="M 42 18 L 42 30 L 50 30 L 50 35"
                      fill="none"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="0.8"
                      strokeDasharray="2,1"
                      opacity="0.8"
                    >
                      <animate attributeName="stroke-dashoffset" values="0;-12" dur="2s" repeatCount="indefinite" />
                    </path>
                  )}

                  {/* POI markers */}
                  {filteredPOIs.map((poi) => (
                    <g
                      key={poi.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedPOI(poi);
                        setToLocation(poi.name);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${poi.name}: ${poi.description}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSelectedPOI(poi);
                          setToLocation(poi.name);
                        }
                      }}
                    >
                      {/* Crowd indicator */}
                      <circle
                        cx={poi.x}
                        cy={poi.y}
                        r="3"
                        fill={poi.crowdLevel === "HIGH" ? "rgba(239,68,68,0.15)" : poi.crowdLevel === "MEDIUM" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)"}
                        className="transition-all duration-300"
                      />
                      {/* Pin */}
                      <circle
                        cx={poi.x}
                        cy={poi.y}
                        r={selectedPOI?.id === poi.id ? "2" : "1.5"}
                        fill={selectedPOI?.id === poi.id ? "rgb(59, 130, 246)" : "var(--foreground)"}
                        opacity={selectedPOI?.id === poi.id ? 1 : 0.6}
                        className="transition-all duration-300"
                      />
                      {/* Label */}
                      <text
                        x={poi.x}
                        y={poi.y - 4}
                        textAnchor="middle"
                        fill="currentColor"
                        fontSize="1.6"
                        fontWeight="500"
                        opacity={selectedPOI?.id === poi.id ? 1 : 0.5}
                        className="pointer-events-none select-none transition-opacity"
                      >
                        {poi.icon} {poi.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Panel */}
        <div className="space-y-4">
          {/* Route Planner */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Route className="w-4 h-4 text-primary" />
                Route Planner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-background" />
                  <Input
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="pl-9 text-sm"
                    placeholder="From..."
                    aria-label="Starting location"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background" />
                  <Input
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="pl-9 text-sm"
                    placeholder="To..."
                    aria-label="Destination"
                  />
                </div>
              </div>

              {/* Route mode */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "fastest", label: "Fastest", icon: "⚡" },
                  { value: "least-crowded", label: "Quiet", icon: "🚶" },
                  { value: "accessible", label: "Accessible", icon: "♿" },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setRouteMode(mode.value as typeof routeMode)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all border",
                      routeMode === mode.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <span>{mode.icon}</span>
                    <span className="font-medium">{mode.label}</span>
                  </button>
                ))}
              </div>

              <Button onClick={handleGetRoute} disabled={isRouting || !toLocation} className="w-full gap-2">
                {isRouting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                {isRouting ? "Finding Route..." : "Get Directions"}
              </Button>
            </CardContent>
          </Card>

          {/* Route Result */}
          {routeResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Route</CardTitle>
                    <Badge variant="secondary" className="text-xs">~2.5 min</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {routeResult.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                          i === 0 ? "bg-blue-500" : i === routeResult.length - 1 ? "bg-red-500" : "bg-muted-foreground"
                        )}>
                          {step.step}
                        </div>
                        {i < routeResult.length - 1 && (
                          <div className="w-0.5 h-8 bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="text-sm font-medium">{step.instruction}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{step.estimatedTime}</span>
                          <div className={cn("w-1.5 h-1.5 rounded-full", crowdColor(step.crowdLevel))} />
                          <span className="text-xs text-muted-foreground">{step.crowdLevel} crowd</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Selected POI */}
          {selectedPOI && !routeResult && (
            <motion.div
              key={selectedPOI.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{selectedPOI.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedPOI.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedPOI.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={cn("w-2 h-2 rounded-full", crowdColor(selectedPOI.crowdLevel))} />
                        <span className="text-xs text-muted-foreground">{selectedPOI.crowdLevel} crowd</span>
                        {selectedPOI.distance && (
                          <span className="text-xs text-muted-foreground">· {selectedPOI.distance} walk</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3 gap-1.5"
                    onClick={() => {
                      setToLocation(selectedPOI.name);
                      handleGetRoute();
                    }}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Navigate Here
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Search POIs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Nearby</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-sm"
                  placeholder="Search places..."
                  aria-label="Search points of interest"
                />
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto">
                {filteredPOIs.slice(0, 8).map((poi) => (
                  <button
                    key={poi.id}
                    onClick={() => {
                      setSelectedPOI(poi);
                      setToLocation(poi.name);
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-sm transition-colors",
                      selectedPOI?.id === poi.id ? "bg-primary/10" : "hover:bg-muted/50"
                    )}
                  >
                    <span className="text-base">{poi.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{poi.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{poi.description}</p>
                    </div>
                    <div className={cn("w-2 h-2 rounded-full shrink-0", crowdColor(poi.crowdLevel))} />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
