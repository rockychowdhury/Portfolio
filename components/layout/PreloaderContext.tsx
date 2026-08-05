"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Preloader from "./Preloader";
import { motion } from "framer-motion";
import { smoothScrollTo } from "@/lib/lenis";

interface PreloaderContextType {
  preloaderDone: boolean;
}

const PreloaderContext = createContext<PreloaderContextType>({ preloaderDone: true });

const PRELOADER_KEY = "hasRunPreloader";

function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function usePreloader() {
  return useContext(PreloaderContext);
}

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(true); // default to true to prevent flicker before effect runs
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Show the preloader once per day (per browser session), instead of only
    // on the very first visit to the tab.
    const lastRun = sessionStorage.getItem(PRELOADER_KEY);
    if (lastRun !== getTodayKey()) {
      setPreloaderDone(false);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem(PRELOADER_KEY, getTodayKey());
    setPreloaderDone(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      if (!isMounted) smoothScrollTo(0, { immediate: true });
    }

    if (preloaderDone && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          smoothScrollTo(element);
          window.history.replaceState(null, "", window.location.pathname);
        }, 100);
      }
    }
  }, [preloaderDone, isMounted]);

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <PreloaderContext.Provider value={{ preloaderDone }}>
      {!preloaderDone && <Preloader key="preloader" onComplete={handleComplete} />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={preloaderDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className={!preloaderDone ? "pointer-events-none" : ""}
      >
        {children}
      </motion.div>
    </PreloaderContext.Provider>
  );
}
