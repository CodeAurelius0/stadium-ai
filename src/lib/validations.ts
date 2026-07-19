import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["ADMIN", "OPERATOR", "VOLUNTEER", "FAN"]).default("FAN"),
});

export const incidentSchema = z.object({
  stadiumId: z.string().min(1),
  type: z.enum(["MEDICAL", "FIRE", "SECURITY", "STRUCTURAL", "CROWD", "OTHER"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  zoneName: z.string().optional(),
});

export const translateSchema = z.object({
  text: z.string().min(1).max(5000),
  sourceLanguage: z.string().min(2).max(10),
  targetLanguage: z.string().min(2).max(10),
  context: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type IncidentInput = z.infer<typeof incidentSchema>;
export type TranslateInput = z.infer<typeof translateSchema>;
