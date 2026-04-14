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
        return <Minus className={cn("text-muted-foreground/60", className)} />;
      case 2:
        return <Star className={cn("text-muted-foreground/80", className)} />;
      case 3:
        return <Zap className={cn("text-amber-500", className)} />;
      case 4:
        return <Trophy className={cn("text-orange-500", className)} />;
      case 5:
        return <Crown className={cn("text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]", className)} />;
      default:
        return <Minus className={cn("text-muted-foreground/60", className)} />;
    }
  };

  return getIcon();
};

export default StrengthIcon;
