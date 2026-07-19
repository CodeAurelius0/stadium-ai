import { create } from "zustand";

// ------- App Store -------
interface AppState {
  selectedStadiumId: string;
  sidebarOpen: boolean;
  isMobile: boolean;
  currentMatchPhase: "PRE_MATCH" | "FIRST_HALF" | "HALFTIME" | "SECOND_HALF" | "POST_MATCH";
  
  setSelectedStadium: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  setMatchPhase: (phase: AppState["currentMatchPhase"]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStadiumId: "metlife",
  sidebarOpen: true,
  isMobile: false,
  currentMatchPhase: "FIRST_HALF",
  
  setSelectedStadium: (id) => set({ selectedStadiumId: id }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIsMobile: (isMobile) => set({ isMobile, sidebarOpen: !isMobile }),
  setMatchPhase: (phase) => set({ currentMatchPhase: phase }),
}));

// ------- Notification Store -------
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: "1",
      title: "Crowd Alert",
      message: "Section 214 approaching 90% capacity. AI recommends redirecting to Section 218.",
      type: "warning",
      timestamp: new Date(Date.now() - 300000),
      read: false,
    },
    {
      id: "2", 
      title: "Queue Update",
      message: "Food Court B wait time reduced to 4 minutes. Optimal time to visit.",
      type: "info",
      timestamp: new Date(Date.now() - 600000),
      read: false,
    },
    {
      id: "3",
      title: "Emergency Resolved",
      message: "Medical incident at Gate C has been resolved. All clear.",
      type: "success",
      timestamp: new Date(Date.now() - 900000),
      read: true,
    },
  ],
  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        { ...notif, id: Math.random().toString(36).slice(2), timestamp: new Date(), read: false },
        ...state.notifications,
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  clearAll: () => set({ notifications: [] }),
}));

// ------- Auth Store (client-side) -------
interface AuthState {
  user: { id: string; name: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "demo-admin",
    name: "Alex Morgan",
    email: "alex@stadiumai.com",
    role: "ADMIN",
  },
  isAuthenticated: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
