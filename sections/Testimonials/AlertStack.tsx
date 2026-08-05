"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface AlertItem {
  id: string;
  type: "success" | "info";
  message: string;
  submessage?: string;
  icon: React.ReactNode;
}

interface AlertStackProps {
  alerts: AlertItem[];
  onDismiss: (id: string) => void;
}

export default function AlertStack({ alerts, onDismiss }: AlertStackProps) {
  return (
    <div className="fixed bottom-8 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none w-full max-w-sm">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-black/90 p-4 text-white shadow-2xl backdrop-blur-md pointer-events-auto"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
              {alert.icon}
            </div>
            <div className="flex-1 space-y-1 pr-6">
              <p className="text-xs font-bold uppercase tracking-wider">{alert.message}</p>
              {alert.submessage && (
                <p className="text-[10px] leading-relaxed text-white/60">{alert.submessage}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(alert.id)}
              className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
