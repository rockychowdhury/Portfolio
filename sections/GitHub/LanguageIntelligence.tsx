"use client";

import { motion } from "framer-motion";
import LanguageBar from "./LanguageBar";

interface LanguageIntelligenceProps {
  languages: {
    name: string;
    color: string;
    size: number;
    percentage: number;
    repoCount: number;
  }[];
}

export default function LanguageIntelligence({ languages }: LanguageIntelligenceProps) {
  return (
    <div className="flex flex-col gap-12">
      {/* Breakdown Bars */}
      <div className="flex flex-col gap-6">
         <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">Top Languages Used:</h3>
         <div className="flex flex-col gap-4">
            {languages.slice(0, 8).map((lang, idx) => (
              <LanguageBar key={lang.name} language={lang} index={idx} />
            ))}
         </div>
      </div>
    </div>
  );
}
