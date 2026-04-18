"use client";

import FloatingCard from "./FloatingCard";
import { ITestimonial } from "@/lib/db/models/Testimonial";

interface FloatingCloudProps {
  testimonials: ITestimonial[];
  isPaused?: boolean;
}

// 1. Define the "Controlled Chaos" Zone Map (x%, y%, rotation, priority)
// Centered around 1400px width. x=50 is the center of the headline.
const GRID_ZONES = [
  // Corner Framing (Occupied, framing the composition)
  { x: 5, y: 12, rot: -2.5, isInert: false, priority: 1 },   // Top Left
  { x: 95, y: 10, rot: 3, isInert: false, priority: 1 },    // Top Right
  { x: 8, y: 92, rot: 1.5, isInert: false, priority: 1 },   // Bottom Left
  { x: 92, y: 90, rot: -2, isInert: true, priority: 1 },    // Bottom Right (clipped suggestion)

  // Near-Center High Strength (Orbiting the headline - pushed further out)
  { x: 20, y: 48, rot: 2.2, isInert: false, priority: 5 },  // Left Mid (Increased buffer)
  { x: 80, y: 52, rot: -1.8, isInert: false, priority: 5 }, // Right Mid (Increased buffer)
  { x: 40, y: 15, rot: -1.5, isInert: false, priority: 5 }, // Top Center Left
  { x: 60, y: 85, rot: 2.4, isInert: false, priority: 5 },  // Bottom Center Right

  // Radial Fill & Editorial Clipping
  { x: -8, y: 60, rot: -3, isInert: true, priority: 3 },    // Clipped Left
  { x: 108, y: 40, rot: 2.5, isInert: true, priority: 3 },  // Clipped Right
  { x: 15, y: 78, rot: -1, isInert: false, priority: 3 },   // Mid Left Gap
  { x: 85, y: 22, rot: 1.2, isInert: false, priority: 3 },  // Mid Right Gap
  { x: 45, y: 95, rot: -1.5, isInert: false, priority: 3 }, // Bottom Edge
  { x: 55, y: 5, rot: 1, isInert: false, priority: 3 },     // Top Edge
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
      <div className="relative w-full max-w-[1400px] mx-auto min-h-[900px] md:min-h-[1100px] py-12 md:py-24 overflow-visible hidden md:block">
        {bloomSortedAssignments.map((assignment, bloomIndex) => {
          const { testimonial, zone } = assignment;
          return (
            <div 
              key={`${testimonial.name}-${bloomIndex}`}
              className="absolute transition-all duration-700"
              style={{ 
                left: `${zone.x}%`, 
                top: `${zone.y}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: zone.isInert ? 'none' : 'auto',
                zIndex: zone.priority === 5 ? 30 : 10
              }}
            >
              <FloatingCard 
                testimonial={testimonial} 
                index={bloomIndex} 
                rotation={zone.rot}
                isPaused={isPaused}
                isInert={zone.isInert}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile: Vertically stacked scrollable layout (< md) */}
      <div className="flex flex-col gap-4 px-2 py-8 md:hidden">
        {sortedTestimonials.slice(0, 6).map((testimonial, i) => (
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
