"use client";

import { motion } from "framer-motion";
import FloatingCard from "./FloatingCard";
import { ITestimonial } from "@/lib/db/models/Testimonial";

interface FloatingCloudProps {
  testimonials: ITestimonial[];
  isPaused?: boolean;
}

// 1. Define the "Controlled Chaos" Zone Map (x%, y%, rotation, priority)
// Centered around 1400px width. x=50 is the center of the headline.
const GRID_ZONES = [
  // Cluster A: Top Left Focus (Further Out)
  { x: 12, y: 18, rot: -1.5, isInert: false, priority: 1 },
  { x: 18, y: 10, rot: 1, isInert: false, priority: 1 },
  { x: 5, y: 35, rot: -2, isInert: false, priority: 1 }, // New

  // Cluster B: Bottom Right Support (Further Out)
  { x: 88, y: 82, rot: 1.5, isInert: false, priority: 1 },
  { x: 82, y: 90, rot: -1, isInert: false, priority: 1 },
  { x: 95, y: 65, rot: 2, isInert: false, priority: 1 }, // New

  // Cluster C: Left Mid Editorial (Further Out)
  { x: 8, y: 55, rot: 0.5, isInert: false, priority: 5 },
  { x: 15, y: 45, rot: -2, isInert: false, priority: 5 },

  // Cluster D: Right Mid Editorial (Further Out)
  { x: 92, y: 45, rot: 2, isInert: false, priority: 5 },
  { x: 85, y: 55, rot: -1.2, isInert: false, priority: 5 },

  // Editorial Spares (Top/Bottom edges, away from center)
  { x: 30, y: 8, rot: -0.5, isInert: false, priority: 3 },
  { x: 70, y: 92, rot: 1.2, isInert: false, priority: 3 },
];

export default function FloatingCloud({ testimonials, isPaused = false }: FloatingCloudProps) {
  // 2. Pair testimonials with zones
  const sortedTestimonials = [...testimonials].sort((a, b) => {
    const strength = { Mentor: 5, Client: 5, Colleague: 4, Collaborator: 4, Classmate: 3 };
    return (strength[b.relationship] || 0) - (strength[a.relationship] || 0);
  });
  
  // Create occupied zones mapping to ensure hierarchy rules
  const assignments = sortedTestimonials.map((testimonial, i) => {
    const zone = GRID_ZONES[i % GRID_ZONES.length];
    const dist = Math.sqrt(Math.pow(zone.x - 50, 2) + Math.pow(zone.y - 50, 2));
    return { testimonial, zone, dist };
  });

  // Sort assignments by distance for the radial bloom 'index'
  const bloomSortedAssignments = [...assignments].sort((a, b) => a.dist - b.dist);

  return (
    <>
      {/* Desktop: Absolute-positioned floating cloud (md+) */}
      <div className="relative w-full max-w-[1400px] mx-auto min-h-[750px] md:min-h-[850px] py-8 md:py-16 overflow-visible hidden md:block">
        {bloomSortedAssignments.map((assignment, bloomIndex) => {
          const { testimonial, zone } = assignment;
          return (
            <motion.div 
              key={`${testimonial.name}-${bloomIndex}`}
              className="absolute"
              style={{ 
                left: `${zone.x}%`, 
                top: `${zone.y}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: zone.isInert ? 'none' : 'auto',
                zIndex: zone.priority === 5 ? 30 : 10
              }}
              whileHover={zone.isInert ? {} : { zIndex: 100 }}
            >
              <FloatingCard 
                testimonial={testimonial} 
                index={bloomIndex} 
                rotation={zone.rot}
                isPaused={isPaused}
                isInert={zone.isInert}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: Vertically stacked scrollable layout (< md) */}
      <div className="flex flex-col gap-4 px-2 py-8 md:hidden">
        {sortedTestimonials.slice(0, 3).map((testimonial, i) => (
          <FloatingCard
            key={`mobile-${testimonial.name}-${i}`}
            testimonial={testimonial}
            index={i}
            rotation={0}
            isPaused={false}
            isInert={false}
            isMobile={true}
          />
        ))}
      </div>
    </>
  );
}
