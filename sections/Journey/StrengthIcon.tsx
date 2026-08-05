"use client";

import React from "react";
import { Trophy, Star, Medal, Award, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StrengthIconProps {
  strength: number;
  className?: string;
}

const StrengthIcon = ({ strength, className }: StrengthIconProps) => {
  // Choose an icon based on the strength level (0-5)
  if (strength >= 5) return <Trophy className={cn("text-amber-500", className)} />;
  if (strength >= 4) return <Award className={cn("text-amber-400", className)} />;
  if (strength >= 3) return <Medal className={cn("text-blue-400", className)} />;
  if (strength >= 2) return <Star className={cn("text-slate-400", className)} />;
  return <Zap className={cn("text-slate-300", className)} />;
};

export default StrengthIcon;
