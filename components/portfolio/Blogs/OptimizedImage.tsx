"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface OptimizedImageProps extends ImageProps {
  containerClassName?: string;
  isPriority?: boolean;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  className, 
  containerClassName = "", 
  isPriority = false,
  ...props 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Safety fallback for cached images or network hang
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 8000); // 8s timeout force-complete

    return () => clearTimeout(timer);
  }, [src]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${containerClassName}`}>
      {/* Shimmer Effect */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 bg-zinc-100 dark:bg-zinc-800 animate-pulse"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      <Image
        src={src}
        alt={alt}
        className={`transition-all duration-500 ease-out ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)} // Handle broken images
        priority={isPriority}
        loading={isPriority ? "eager" : "lazy"}
        {...props}
      />

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
}
