export const APP_NAME = "StadiumAI";
export const APP_DESCRIPTION = "AI-Powered FIFA World Cup 2026 Stadium Operations Platform";
export const APP_VERSION = "1.0.0";

export const ROLES = {
  ADMIN: "ADMIN",
  OPERATOR: "OPERATOR",
  VOLUNTEER: "VOLUNTEER",
  FAN: "FAN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const INCIDENT_TYPES = [
  { value: "MEDICAL", label: "Medical Emergency", icon: "🏥" },
  { value: "FIRE", label: "Fire", icon: "🔥" },
  { value: "SECURITY", label: "Security Threat", icon: "🔒" },
  { value: "STRUCTURAL", label: "Structural Issue", icon: "🏗️" },
  { value: "CROWD", label: "Crowd Issue", icon: "👥" },
  { value: "OTHER", label: "Other", icon: "📋" },
] as const;

export const SEVERITY_LEVELS = [
  { value: "LOW", label: "Low", color: "blue" },
  { value: "MEDIUM", label: "Medium", color: "amber" },
  { value: "HIGH", label: "High", color: "orange" },
  { value: "CRITICAL", label: "Critical", color: "red" },
] as const;

export const ZONE_TYPES = [
  { value: "GATE", label: "Gate", icon: "🚪" },
  { value: "STAND", label: "Stand", icon: "🏟️" },
  { value: "CONCOURSE", label: "Concourse", icon: "🚶" },
  { value: "FOOD", label: "Food Court", icon: "🍔" },
  { value: "RESTROOM", label: "Restroom", icon: "🚻" },
  { value: "EXIT", label: "Exit", icon: "🚪" },
  { value: "MEDICAL", label: "Medical Station", icon: "🏥" },
  { value: "VIP", label: "VIP Area", icon: "⭐" },
  { value: "PARKING", label: "Parking", icon: "🅿️" },
] as const;

export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Bahasa Melayu", flag: "🇲🇾" },
] as const;

export const QUEUE_CATEGORIES = [
  { value: "FOOD", label: "Food", icon: "🍔" },
  { value: "BEVERAGE", label: "Beverages", icon: "🥤" },
  { value: "RESTROOM", label: "Restroom", icon: "🚻" },
  { value: "ENTRY", label: "Entry Gate", icon: "🚪" },
  { value: "MERCH", label: "Merchandise", icon: "👕" },
] as const;

export const NAV_ITEMS = [
  { href: "/", label: "Command Center", icon: "LayoutDashboard", roles: ["ADMIN", "OPERATOR"] },
  { href: "/crowd", label: "Crowd AI", icon: "Users", roles: ["ADMIN", "OPERATOR"] },
  { href: "/emergency", label: "Emergency", icon: "AlertTriangle", roles: ["ADMIN", "OPERATOR", "VOLUNTEER"] },
  { href: "/navigate", label: "Navigator", icon: "Map", roles: ["ADMIN", "OPERATOR", "VOLUNTEER", "FAN"] },
  { href: "/queues", label: "Queues", icon: "Clock", roles: ["ADMIN", "OPERATOR", "VOLUNTEER", "FAN"] },
  { href: "/translate", label: "Translator", icon: "Globe", roles: ["ADMIN", "OPERATOR", "VOLUNTEER", "FAN"] },
] as const;

// Demo stadium data for when DB is empty
export const DEMO_STADIUMS = [
  {
    id: "metlife",
    name: "MetLife Stadium",
    city: "East Rutherford, NJ",
    country: "USA",
    capacity: 82500,
    latitude: 40.8135,
    longitude: -74.0745,
  },
  {
    id: "attstadium",
    name: "AT&T Stadium",
    city: "Arlington, TX",
    country: "USA",
    capacity: 80000,
    latitude: 32.7473,
    longitude: -97.0945,
  },
  {
    id: "azteca",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    capacity: 87523,
    latitude: 19.3029,
    longitude: -99.1505,
  },
] as const;
