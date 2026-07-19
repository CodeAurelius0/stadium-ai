"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppStore, useAuthStore } from "@/stores";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Map,
  Clock,
  Globe,
  ChevronLeft,
  Shield,
  Zap,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Map,
  Clock,
  Globe,
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { user } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex flex-col h-screen bg-sidebar-background border-r border-sidebar-border fixed left-0 top-0 z-40"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-3 group" aria-label="StadiumAI Home">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-amber-600 shadow-lg shadow-sidebar-primary/20 transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-sidebar-background animate-pulse" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">
                  {APP_NAME}
                </h1>
                <p className="text-[10px] text-sidebar-foreground/50 tracking-widest uppercase">
                  FIFA 2026
                </p>
              </motion.div>
            )}
          </Link>

          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="ml-auto p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = pathname === item.href;
            const hasAccess = !user?.role || item.roles.includes(user.role as any);

            if (!hasAccess) return null;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-sidebar-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-sidebar-primary")} />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-sidebar-border">
          {sidebarOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-sidebar-foreground/50 truncate">
                  {user?.role || "Fan"}
                </p>
              </div>
              <Zap className="w-3.5 h-3.5 text-sidebar-primary" />
            </motion.div>
          ) : (
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
