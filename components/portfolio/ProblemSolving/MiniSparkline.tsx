import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface MiniSparklineProps {
  data: number[];
  color: string;
  width?: number; // fallback/base width
  height?: number;
  strokeWidth?: number;
}

export default function MiniSparkline({
  data,
  color,
  width = 400,
  height = 80,
  strokeWidth = 3,
}: MiniSparklineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = strokeWidth * 4;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * graphWidth;
    const y = padding + graphHeight - ((val - min) / range) * graphHeight;
    return { x, y, value: val };
  });

  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const svg = containerRef.current;
    const CTM = svg.getScreenCTM();
    if (!CTM) return;
    
    const x = (e.clientX - CTM.e) / CTM.a;
    
    // Find closest point
    let closestIndex = 0;
    let minDistance = Math.abs(x - points[0].x);
    
    for (let i = 1; i < points.length; i++) {
      const dist = Math.abs(x - points[i].x);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }
    
    setActiveIndex(closestIndex);
  };

  return (
    <div className="relative w-full h-full group/sparkline">
      <svg 
        ref={containerRef}
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`} 
        className="overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setActiveIndex(null);
        }}
        onMouseMove={handleMouseMove}
      >
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Fill Area */}
        <motion.path
          d={`${pathData} L ${width - padding},${height} L ${padding},${height} Z`}
          fill={`url(#gradient-${color.replace('#', '')})`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Main Path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "circOut" }}
          style={{ filter: isHovered ? 'url(#glow)' : 'none' }}
        />

        {/* Interactive Elements */}
        {activeIndex !== null && (
          <g>
            {/* Vertical Guide Line */}
            <motion.line
              x1={points[activeIndex].x}
              y1={0}
              x2={points[activeIndex].x}
              y2={height}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
            />
            
            {/* Active Point Dot */}
            <motion.circle
              cx={points[activeIndex].x}
              cy={points[activeIndex].y}
              r={strokeWidth * 1.5}
              fill="#fff"
              stroke={color}
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </g>
        )}
      </svg>

      {/* Interactive Tooltip */}
      {activeIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute z-[9999] pointer-events-none"
          style={{ 
            left: `${(points[activeIndex].x / width) * 100}%`,
            top: `${(points[activeIndex].y / height) * 100}%`,
            // Flip side based on available width
            transform: (points[activeIndex].x / width) > 0.7 
              ? 'translate(-100%, -140%)' 
              : (points[activeIndex].x / width) < 0.3
                ? 'translate(0%, -140%)'
                : 'translate(-50%, -140%)'
          }}
        >
          <div className="px-3 py-1.5 rounded-lg bg-background/95 backdrop-blur-md border border-border/20 shadow-2xl flex items-center gap-2 min-w-max">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm font-black tabular-nums text-foreground">
              {points[activeIndex].value.toLocaleString()}
            </span>
          </div>
          {/* Tooltip arrow */}
          <div 
            className={`w-2 h-2 bg-background/95 border-r border-b border-border/20 rotate-45 absolute bottom-0 translate-y-1/2 ${
              (points[activeIndex].x / width) > 0.7 
                ? 'right-4' 
                : (points[activeIndex].x / width) < 0.3 
                  ? 'left-4' 
                  : 'left-1/2 -translate-x-1/2'
            }`} 
          />
        </motion.div>
      )}
    </div>
  );
}
