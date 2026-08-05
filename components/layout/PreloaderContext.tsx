"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Preloader from "./Preloader";
import { motion } from "framer-motion";

interface PreloaderContextType {
  preloaderDone: boolean;
}

const PreloaderContext = createContext<PreloaderContextType>({ preloaderDone: true });

export function usePreloader() {
  return useContext(PreloaderContext);
}

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(true); // default to true to prevent flicker before effect runs
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasRun = sessionStorage.getItem("hasRunPreloader");
    if (!hasRun) {
      setPreloaderDone(false);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem("hasRunPreloader", "true");
    setPreloaderDone(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      if (!isMounted) window.scrollTo(0, 0);
    }

    if (preloaderDone && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
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
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className={!preloaderDone ? "pointer-events-none" : ""}
      >
        {children}
      </motion.div>
    </PreloaderContext.Provider>
  );
}
