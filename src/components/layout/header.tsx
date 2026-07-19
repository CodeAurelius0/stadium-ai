"use client";

import { useTheme } from "next-themes";
import { useNotificationStore, useAppStore } from "@/stores";
import { DEMO_STADIUMS } from "@/lib/constants";
import {
  Bell,
  Moon,
  Sun,
  Search,
  Menu,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { notifications, markAsRead } = useNotificationStore();
  const { selectedStadiumId, setSelectedStadium, toggleSidebar } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStadiumSelect, setShowStadiumSelect] = useState(false);
  const [mounted, setMounted] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const selectedStadium = DEMO_STADIUMS.find((s) => s.id === selectedStadiumId) || DEMO_STADIUMS[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Stadium selector */}
          <div className="relative">
            <button
              onClick={() => setShowStadiumSelect(!showStadiumSelect)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
              aria-label="Select stadium"
              aria-expanded={showStadiumSelect}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium hidden sm:inline">{selectedStadium.name}</span>
              <span className="font-medium sm:hidden">{selectedStadium.city.split(",")[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            
            <AnimatePresence>
              {showStadiumSelect && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-border bg-popover shadow-xl p-2 z-50"
                >
                  {DEMO_STADIUMS.map((stadium) => (
                    <button
                      key={stadium.id}
                      onClick={() => {
                        setSelectedStadium(stadium.id);
                        setShowStadiumSelect(false);
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors ${
                        stadium.id === selectedStadiumId
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="text-xl">🏟️</div>
                      <div>
                        <p className="text-sm font-medium">{stadium.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {stadium.city}, {stadium.country} · {(stadium.capacity / 1000).toFixed(0)}K seats
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden lg:flex items-center max-w-md flex-1 mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search zones, incidents, vendors..."
              className="w-full h-9 pl-10 pr-4 rounded-lg border border-input bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all duration-200"
              aria-label="Search"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden xl:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live
          </div>

          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="relative"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications (${unreadCount} unread)`}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
                >
                  {unreadCount}
                </motion.span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-popover shadow-xl z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <Badge variant="secondary" className="text-[10px]">
                      {unreadCount} new
                    </Badge>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`flex gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 ${
                            !notif.read ? "bg-primary/5" : ""
                          }`}
                        >
                          <div
                            className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                              notif.type === "warning"
                                ? "bg-amber-500"
                                : notif.type === "error"
                                ? "bg-red-500"
                                : notif.type === "success"
                                ? "bg-emerald-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{notif.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                              {new Date(notif.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click-outside handler for dropdowns */}
      {(showNotifications || showStadiumSelect) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowStadiumSelect(false);
          }}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
