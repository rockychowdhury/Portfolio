"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Premium easing for sections
const premiumEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1] as const;

const letterAnimation = {
  hidden: { opacity: 0, y: 40, rotateX: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 + i * 0.05,
      ease: premiumEase,
    },
  }),
};

const JourneySection = () => {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-10%" });

  const titleWords = "Professional".split(" ");
  const accentWords = "Journey".split("");

  return (
    <section 
      id="journey"
      className="relative w-full overflow-hidden bg-background py-24 px-6 md:px-12 lg:px-20 text-foreground"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Animated Section Header Only */}
        <div className="mb-16 lg:pl-16 text-left" ref={titleRef}>
          <div className="flex flex-col gap-2">
            <h2 className="flex flex-wrap items-end text-[3.5rem] font-medium leading-[1.1] tracking-tighter text-foreground sm:text-[5rem] md:text-[6rem] lg:text-[8rem]">
              {titleWords.map((word, wordIdx) => (
                <div key={wordIdx} className="flex overflow-hidden mr-4 pb-4 -mb-4">
                  {word.split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      custom={i + (wordIdx * 5)}
                      variants={letterAnimation}
                      initial="hidden"
                      animate={isTitleInView ? "visible" : "hidden"}
                      className="inline-block origin-bottom"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              ))}
              <div className="flex overflow-hidden pb-4 -mb-4">
                {accentWords.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i + 15}
                    variants={letterAnimation}
                    initial="hidden"
                    animate={isTitleInView ? "visible" : "hidden"}
                    className="inline-block origin-bottom text-muted-foreground/30 font-light"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isTitleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: premiumEase }}
            className="mt-8 flex items-center gap-4"
          >
            <div className="h-px w-8 bg-foreground/40" />
            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/60">
              [ 04. JOURNEY ]
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};




export default JourneySection;
