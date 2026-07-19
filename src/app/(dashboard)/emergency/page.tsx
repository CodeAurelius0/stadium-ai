"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Plus,
  Clock,
  MapPin,
  User,
  Sparkles,
  RefreshCw,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getSeverityColor, getStatusColor, timeAgo } from "@/lib/utils";
import { INCIDENT_TYPES, SEVERITY_LEVELS } from "@/lib/constants";

interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "REPORTED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  location: string;
  reporter: string;
  assignee?: string;
  aiAssessment?: string;
  createdAt: Date;
}

const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    title: "Fan experiencing chest pain in Section 108",
    description: "Male, approximately 55 years old, complaining of chest tightness and shortness of breath. Seated in Row G, Seat 14.",
    type: "MEDICAL",
    severity: "CRITICAL",
    status: "IN_PROGRESS",
    location: "Section 108, Row G",
    reporter: "Volunteer Martinez",
    assignee: "Medical Team Alpha",
    aiAssessment: "HIGH PRIORITY: Symptoms suggest possible cardiac event. Nearest AED is 45m away at Medical Station 3. Ambulance ETA: 4 minutes. Recommend immediate First Aid and AED deployment. Clear path via Concourse N for stretcher access.",
    createdAt: new Date(Date.now() - 180000),
  },
  {
    id: "INC-002",
    title: "Crowd congestion at Gate C entrance",
    description: "Large crowd buildup at Gate C security checkpoint. Flow rate dropped below 200/min. Fans becoming frustrated.",
    type: "CROWD",
    severity: "HIGH",
    status: "ASSIGNED",
    location: "Gate C",
    reporter: "Security Officer Chen",
    assignee: "Crowd Control Unit 3",
    aiAssessment: "Congestion is likely caused by a reduced number of active screening lanes. Recommend opening auxiliary lanes 5-6. Consider redirecting signage to Gate D (currently at 42% capacity). Estimated clearance: 15 minutes with intervention.",
    createdAt: new Date(Date.now() - 600000),
  },
  {
    id: "INC-003",
    title: "Water spill creating slip hazard at Food Court B",
    description: "Large water spill from burst pipe near vendor station 4. Area is approximately 3x3 meters.",
    type: "OTHER",
    severity: "MEDIUM",
    status: "REPORTED",
    location: "Food Court B, Vendor 4",
    reporter: "Staff Thompson",
    createdAt: new Date(Date.now() - 900000),
  },
  {
    id: "INC-004",
    title: "Unattended bag near Gate A checkpoint",
    description: "Black backpack left unattended near the security checkpoint. Has been there for approximately 10 minutes.",
    type: "SECURITY",
    severity: "HIGH",
    status: "IN_PROGRESS",
    location: "Gate A Security",
    reporter: "Security Officer Park",
    assignee: "Security Response Team",
    aiAssessment: "Standard protocol: Establish 30m cordon. Notify bomb squad. Review CCTV for last 20 minutes to identify owner. Current area foot traffic: 340/min — recommend diversion via south corridor.",
    createdAt: new Date(Date.now() - 1200000),
  },
  {
    id: "INC-005",
    title: "Minor altercation between fans in Section 215",
    description: "Two groups of fans in verbal dispute. Has not escalated to physical contact yet.",
    type: "SECURITY",
    severity: "MEDIUM",
    status: "ASSIGNED",
    location: "Section 215, Row M",
    reporter: "Steward Williams",
    assignee: "Security Team B",
    createdAt: new Date(Date.now() - 1500000),
  },
];

export default function EmergencyPage() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // New incident form state
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    type: "MEDICAL",
    location: "",
  });

  const filteredIncidents = filterSeverity === "ALL"
    ? incidents
    : incidents.filter((i) => i.severity === filterSeverity);

  const activeCount = incidents.filter((i) => i.status !== "RESOLVED").length;
  const criticalCount = incidents.filter((i) => i.severity === "CRITICAL" && i.status !== "RESOLVED").length;

  const handleCreateIncident = async () => {
    if (!newIncident.title || !newIncident.description) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    let aiAssessment = "";
    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncident),
      });
      if (response.ok) {
        const data = await response.json();
        aiAssessment = data.aiAssessment || "";
      }
    } catch {
      aiAssessment = `AI Assessment: Based on the reported ${newIncident.type.toLowerCase()} incident at ${newIncident.location || "unspecified location"}, recommend deploying nearest available response team. Priority: Medium. Estimated response time: 3-5 minutes.`;
    }

    const incident: Incident = {
      id: `INC-${String(incidents.length + 1).padStart(3, "0")}`,
      title: newIncident.title,
      description: newIncident.description,
      type: newIncident.type,
      severity: "MEDIUM",
      status: "REPORTED",
      location: newIncident.location || "Unspecified",
      reporter: "You",
      aiAssessment,
      createdAt: new Date(),
    };

    setIncidents([incident, ...incidents]);
    setSelectedIncident(incident);
    setShowNewForm(false);
    setNewIncident({ title: "", description: "", type: "MEDICAL", location: "" });
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-3">
            Emergency Response
            {criticalCount > 0 && (
              <Badge variant="danger" className="animate-pulse">
                {criticalCount} Critical
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered incident management and emergency coordination
          </p>
        </div>
        <Button onClick={() => setShowNewForm(true)} className="gap-2" variant="glow">
          <Plus className="w-4 h-4" />
          Report Incident
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Incidents", value: activeCount, color: "text-red-500" },
          { label: "Critical", value: criticalCount, color: "text-red-600" },
          { label: "Avg Response", value: "3.2 min", color: "text-blue-500" },
          { label: "Resolved Today", value: 14, color: "text-emerald-500" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Filter:</span>
        {["ALL", ...SEVERITY_LEVELS.map((s) => s.value)].map((level) => (
          <button
            key={level}
            onClick={() => setFilterSeverity(level)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              filterSeverity === level
                ? "bg-primary text-primary-foreground shadow"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {level}
          </button>
        ))}
      </div>

      {/* New Incident Form */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Report New Incident
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="incident-title" className="text-sm font-medium">Title</label>
                    <Input
                      id="incident-title"
                      placeholder="Brief description of the incident"
                      value={newIncident.title}
                      onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="incident-location" className="text-sm font-medium">Location</label>
                    <Input
                      id="incident-location"
                      placeholder="e.g., Section 108, Gate C"
                      value={newIncident.location}
                      onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="incident-type" className="text-sm font-medium">Type</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {INCIDENT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setNewIncident({ ...newIncident, type: type.value })}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-lg border text-xs transition-all",
                          newIncident.type === type.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-lg">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="incident-desc" className="text-sm font-medium">Description</label>
                  <textarea
                    id="incident-desc"
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px] transition-colors"
                    placeholder="Provide detailed information about the incident..."
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
                  <Button onClick={handleCreateIncident} disabled={isAnalyzing || !newIncident.title || !newIncident.description} className="gap-2">
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Submit with AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incidents List + Detail */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Incident List */}
        <div className="lg:col-span-2 space-y-2">
          {filteredIncidents.map((incident, index) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                onClick={() => setSelectedIncident(incident)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                  selectedIncident?.id === incident.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {INCIDENT_TYPES.find((t) => t.value === incident.type)?.icon || "📋"}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{incident.id}</span>
                  </div>
                  <Badge className={cn("text-[10px] border", getSeverityColor(incident.severity))}>
                    {incident.severity}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium line-clamp-2 mb-2">{incident.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {incident.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(incident.createdAt)}
                    </span>
                  </div>
                  <Badge className={cn("text-[10px]", getStatusColor(incident.status))}>
                    {incident.status.replace("_", " ")}
                  </Badge>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Incident Detail */}
        <div className="lg:col-span-3">
          {selectedIncident ? (
            <motion.div
              key={selectedIncident.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">
                          {INCIDENT_TYPES.find((t) => t.value === selectedIncident.type)?.icon}
                        </span>
                        <span className="text-sm text-muted-foreground font-mono">{selectedIncident.id}</span>
                        <Badge className={cn("text-[10px] border", getSeverityColor(selectedIncident.severity))}>
                          {selectedIncident.severity}
                        </Badge>
                        <Badge className={cn("text-[10px]", getStatusColor(selectedIncident.status))}>
                          {selectedIncident.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{selectedIncident.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedIncident.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-medium">{selectedIncident.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Reporter</p>
                        <p className="font-medium">{selectedIncident.reporter}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Reported</p>
                        <p className="font-medium">{timeAgo(selectedIncident.createdAt)}</p>
                      </div>
                    </div>
                    {selectedIncident.assignee && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Assigned To</p>
                          <p className="font-medium">{selectedIncident.assignee}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Assessment */}
                  {selectedIncident.aiAssessment && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 shrink-0">
                          <Sparkles className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">AI Assessment</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {selectedIncident.aiAssessment}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {selectedIncident.status !== "RESOLVED" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => {
                            setIncidents(incidents.map(i => 
                              i.id === selectedIncident.id 
                                ? { ...i, status: "IN_PROGRESS" as const }
                                : i
                            ));
                            setSelectedIncident({ ...selectedIncident, status: "IN_PROGRESS" });
                          }}
                        >
                          <ChevronDown className="w-3 h-3" />
                          Escalate
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="gap-1.5"
                          onClick={() => {
                            setIncidents(incidents.map(i => 
                              i.id === selectedIncident.id 
                                ? { ...i, status: "RESOLVED" as const }
                                : i
                            ));
                            setSelectedIncident({ ...selectedIncident, status: "RESOLVED" });
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Resolve
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <AlertTriangle className="w-12 h-12 text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground">Select an incident to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
