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
  // Corner Framing (Pushed further out to clear the center)
  { x: 8, y: 15, rot: -2, isInert: false, priority: 1 },    // Top Left
  { x: 92, y: 12, rot: 2, isInert: false, priority: 1 },    // Top Right
  { x: 10, y: 85, rot: 1, isInert: false, priority: 1 },    // Bottom Left
  { x: 90, y: 88, rot: -1.5, isInert: true, priority: 1 },  // Bottom Right

  // Mid-Distance Framing (Orbiting with more buffer)
  { x: 15, y: 50, rot: 1.5, isInert: false, priority: 5 },  // Far Left Mid
  { x: 85, y: 50, rot: -1.2, isInert: false, priority: 5 }, // Far Right Mid
  { x: 40, y: 10, rot: -1, isInert: false, priority: 5 },   // Top Framing
  { x: 60, y: 90, rot: 1.8, isInert: false, priority: 5 },  // Bottom Framing

  // Radial Fill & Editorial Clipping
  { x: -5, y: 40, rot: -2, isInert: true, priority: 3 },    // Clipped Left
  { x: 105, y: 60, rot: 2, isInert: true, priority: 3 },    // Clipped Right
  { x: 25, y: 20, rot: -1, isInert: false, priority: 3 },   // Top Left Gap
  { x: 75, y: 80, rot: 1, isInert: false, priority: 3 },    // Bottom Right Gap
  { x: 35, y: 95, rot: -1, isInert: false, priority: 3 },   // Bottom Edge
  { x: 65, y: 5, rot: 0.5, isInert: false, priority: 3 },   // Top Edge
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
