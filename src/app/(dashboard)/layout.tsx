"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAppStore } from "@/stores";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen, setIsMobile } = useAppStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <motion.main
        initial={false}
        animate={{
          marginLeft: typeof window !== "undefined" && window.innerWidth >= 768
            ? sidebarOpen ? 260 : 72
            : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 flex flex-col min-h-screen"
      >
        <Header />
        <div className="flex-1 p-4 lg:p-6 pb-20 md:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </motion.main>

      <MobileNav />
    </div>
  );
}
