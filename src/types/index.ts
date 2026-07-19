export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "OPERATOR" | "VOLUNTEER" | "FAN";
  avatarUrl?: string;
  language?: string;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}

export interface Zone {
  id: string;
  stadiumId: string;
  name: string;
  type: ZoneType;
  capacity: number;
  currentCount: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ZoneType =
  | "GATE"
  | "STAND"
  | "CONCOURSE"
  | "FOOD"
  | "RESTROOM"
  | "EXIT"
  | "MEDICAL"
  | "VIP"
  | "PARKING";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IncidentType =
  | "MEDICAL"
  | "FIRE"
  | "SECURITY"
  | "STRUCTURAL"
  | "CROWD"
  | "OTHER";

export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IncidentStatus =
  | "REPORTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface Incident {
  id: string;
  stadiumId: string;
  reporterId?: string;
  assigneeId?: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  aiAssessment?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  zoneName?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface CrowdData {
  id: string;
  zoneId: string;
  currentCount: number;
  predictedCount: number;
  riskLevel: RiskLevel;
  timestamp: Date;
}

export interface QueuePoint {
  id: string;
  zoneId: string;
  name: string;
  vendor?: string;
  category: "FOOD" | "BEVERAGE" | "RESTROOM" | "ENTRY" | "MERCH";
  currentWaitMinutes: number;
  predictedWaitMinutes: number;
  queueLength: number;
  isOpen: boolean;
}

export interface TranslationResult {
  translation: string;
  pronunciation?: string;
  culturalNote?: string;
  alternatives?: string[];
}

export interface RouteStep {
  step: number;
  instruction: string;
  zone: string;
  estimatedTime: string;
  crowdLevel: "LOW" | "MEDIUM" | "HIGH";
}

export interface AIInsight {
  id: string;
  message: string;
  type: "info" | "warning" | "critical";
  confidence: number;
  timestamp: Date;
}

export type MatchPhase =
  | "PRE_MATCH"
  | "FIRST_HALF"
  | "HALFTIME"
  | "SECOND_HALF"
  | "POST_MATCH";

export interface MatchInfo {
  homeTeam: string;
  awayTeam: string;
  score: string;
  phase: MatchPhase;
  minute: number;
  stadium: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
