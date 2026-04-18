"use client";

import { motion } from "framer-motion";

const premiumEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full overflow-hidden bg-background pt-16 pb-0">
      <div className="container-main">
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-wrap items-center justify-center w-full gap-x-8 gap-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 border-t border-foreground/5 pt-12">
            <span className="text-center">{`© ${currentYear} // রকি চৌধুরী`}</span>
          </div>

          {/* ── Floating Back to Top (Absolute in Footer) ── */}
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.1 }}
            className="absolute bottom-12 right-6 md:right-12 z-50 group flex flex-col items-center gap-3 transition-colors cursor-pointer"
          >
            <div className="relative h-10 w-6 rounded-full border-2 border-foreground/20 p-1 bg-background/50 backdrop-blur-sm group-hover:border-foreground/40 transition-colors shadow-lg">
              <motion.div
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto h-2 w-1 rounded-full bg-foreground/40 group-hover:bg-foreground/60"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/30 group-hover:text-foreground/60 transition-colors">
              Top
            </span>
          </motion.button>
        </div>
      </div>

      {/* ── Giant Signature Typography (Flush Bottom) ── */}
      <div className="relative select-none flex justify-center items-end mt-8 overflow-hidden">
        <motion.h1
          initial={{ y: "40%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="text-[clamp(3rem,15vw,8rem)] md:text-[clamp(5rem,10.2vw,14rem)] font-black tracking-tighter leading-tight md:leading-[0.8] text-foreground uppercase text-center translate-y-0 md:translate-y-[10%] px-4 flex flex-col md:block"
        >
          <span>ROCKY</span>{" "}
          <span className="opacity-20 md:opacity-10">CHOWDHURY</span>
        </motion.h1>
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
    </footer>
  );
}