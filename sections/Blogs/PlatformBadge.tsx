"use client";

import { FaLinkedin, FaYoutube, FaMedium, FaDev, FaHashnode } from "react-icons/fa6";
import { SiNotion } from "react-icons/si";

export type Platform = "LinkedIn" | "YouTube" | "Medium" | "Dev.to" | "Hashnode" | "Notion";

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
  variant?: "branded" | "mono";
}

const platformConfig = {
  LinkedIn: {
    color: "bg-[#0077b5]",
    icon: FaLinkedin,
    label: "LinkedIn",
  },
  YouTube: {
    color: "bg-[#ff0000]",
    icon: FaYoutube,
    label: "YouTube",
  },
  Medium: {
    color: "bg-[#000000]",
    icon: FaMedium,
    label: "Medium",
  },
  "Dev.to": {
    color: "bg-[#0a0a0a]",
    icon: FaDev,
    label: "Dev.to",
  },
  Hashnode: {
    color: "bg-[#2962ff]",
    icon: FaHashnode,
    label: "Hashnode",
  },
  Notion: {
    color: "bg-[#000000]",
    icon: SiNotion,
    label: "Notion",
  },
};

export default function PlatformBadge({ platform, className = "", variant = "branded" }: PlatformBadgeProps) {
  const config = platformConfig[platform];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 group-hover:-translate-y-0.5 shadow-sm ${
        variant === "branded" 
        ? `${config.color} text-white` 
        : "bg-background text-foreground border border-border/40"
      } ${className}`}
    >
      <Icon size={12} className={variant === "branded" ? "text-white" : "text-foreground"} />
      <span className={variant === "branded" ? "text-white" : "text-foreground"}>{config.label}</span>
    </div>
  );
}
