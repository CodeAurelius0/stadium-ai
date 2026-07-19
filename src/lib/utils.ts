import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case "LOW": return "text-emerald-500";
    case "MEDIUM": return "text-amber-500";
    case "HIGH": return "text-orange-500";
    case "CRITICAL": return "text-red-500";
    default: return "text-muted-foreground";
  }
}

export function getRiskBg(risk: string): string {
  switch (risk) {
    case "LOW": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "MEDIUM": return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "HIGH": return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    case "CRITICAL": return "bg-red-500/10 text-red-600 dark:text-red-400";
    default: return "bg-muted text-muted-foreground";
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "LOW": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "MEDIUM": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    case "HIGH": return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800";
    case "CRITICAL": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
    default: return "bg-muted text-muted-foreground border-border";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "REPORTED": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "ASSIGNED": return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "IN_PROGRESS": return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "RESOLVED": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "CLOSED": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
