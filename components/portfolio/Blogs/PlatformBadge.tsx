"use client";

import { FaLinkedin, FaYoutube, FaMedium, FaDev, FaHashnode } from "react-icons/fa6";

export type Platform = "LinkedIn" | "YouTube" | "Medium" | "Dev.to" | "Hashnode";

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
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
};

export default function PlatformBadge({ platform, className = "" }: PlatformBadgeProps) {
  const config = platformConfig[platform];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider ${config.color} ${className} transition-transform duration-300 group-hover:-translate-y-0.5`}
    >
      <Icon size={12} />
      <span>{config.label}</span>
    </div>
  );
}
