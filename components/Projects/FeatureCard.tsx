"use client";

import { FeatureCard as FeatureCardType } from "@/types/project";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  card: FeatureCardType;
  accentColor: string;
  projectName: string;
}

export default function FeatureCard({
  card,
  accentColor,
  projectName,
}: FeatureCardProps) {
  return (
    <a
      href={card.ctaLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-[320px] rounded-xl overflow-hidden bg-card border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      style={{ willChange: "transform" }}
    >
      {/* Image — top 55% */}
      <div className="relative w-full h-[110px] overflow-hidden">
        <img
          src={card.image}
          alt={card.headline}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Project accent chip */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm"
          style={{ backgroundColor: `${accentColor}CC` }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          {projectName}
        </div>
      </div>

      {/* Text — bottom 45% */}
      <div className="p-4 flex flex-col gap-2">
        <h4 className="text-sm font-bold text-foreground leading-snug tracking-tight line-clamp-2">
          {card.headline}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {card.subtext}
        </p>
        <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-foreground/60 group-hover:text-foreground transition-colors">
          {card.ctaLabel}
          <ArrowRight className="size-3 group-hover:translate-x-[3px] transition-transform" />
        </div>
      </div>
    </a>
  );
}
