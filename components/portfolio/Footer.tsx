"use client";

import { motion } from "framer-motion";

const premiumEase: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full overflow-hidden bg-background pt-16 pb-0 border-t border-border/40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center gap-10">
          {/* ── Animated Scroll to Top Indicator ── */}
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col items-center gap-3 transition-opacity hover:opacity-70"
          >
            <div className="relative h-10 w-6 rounded-full border-2 border-muted-foreground/30 p-1">
              <motion.div
                animate={{
                  y: [0, 4, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto h-2 w-1 rounded-full bg-muted-foreground/50"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">
              Back to Top
            </span>
          </motion.button>

          {/* ── Minimalist Utility Line: Links & Copyright ── */}
          <div className="flex flex-wrap items-end justify-between w-full gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <a href="#skills" className="hover:text-foreground transition-colors">Skills</a>
              <a href="#projects" className="hover:text-foreground transition-colors">Projects</a>
              <a href="#education" className="hover:text-foreground transition-colors">Education</a>
              <a href="#blogs" className="hover:text-foreground transition-colors">Blogs</a>
              <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <span className="text-right">{`© ${currentYear} // রকি চৌধুরী`}</span>
          </div>
        </div>
      </div>

      {/* ── Giant Signature Typography (Flush Bottom) ── */}
      <div className="relative select-none flex justify-center items-end mt-8 overflow-hidden">
        <motion.h1 
          initial={{ y: "40%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="text-[16vw] md:text-[10.2vw] font-black tracking-tighter leading-[0.8] text-foreground uppercase text-center translate-y-[10%] px-4"
        >
          ROCKY <span className="hidden md:inline opacity-10">CHOWDHURY</span>
        </motion.h1>
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
    </footer>
  );
}