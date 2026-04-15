import React from "react";
import { Minus, Star, Zap, Trophy, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StrengthIconProps {
  strength: number;
  className?: string;
}

const StrengthIcon = ({ strength, className }: StrengthIconProps) => {
  const getIcon = () => {
    switch (strength) {
      case 1:
        return <Minus className={cn("text-muted-foreground/40", className)} />;
      case 2:
        return <Star className={cn("text-muted-foreground/70", className)} />;
      case 3:
        return <Zap className={cn("text-amber-500/80 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]", className)} />;
      case 4:
        return <Trophy className={cn("text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]", className)} />;
      case 5:
        return <Crown className={cn("text-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]", className)} />;
      default:
        return <Minus className={cn("text-muted-foreground/40", className)} />;
    }
  };

  return getIcon();
};

export default StrengthIcon;
