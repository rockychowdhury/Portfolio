"use client";

import { motion } from "framer-motion";
import { ICertification } from "@/lib/db/models/Certification";
import { MapPin, Calendar, Globe } from "lucide-react";

interface Props {
  item: ICertification;
}

export default function BentoHeroCell({ item }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="col-span-1 md:col-span-2 row-span-2 relative group lg:min-h-[450px]"
    >
      <motion.div
        whileHover={{ y: -5 }}
        className="h-full bg-card border border-border/50 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden shadow-sm transition-all hover:shadow-2xl hover:border-primary/30 relative"
      >
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-20 -mb-20 blur-3xl opacity-50" />

        {/* Top Section: Institution Logo + Badge */}
        <div className="flex justify-between items-start relative z-10">
          <div className="p-5 bg-secondary/30 rounded-3xl border border-border/50 backdrop-blur-sm group-hover:scale-105 transition-transform duration-500">
            <img
              src={item.ins_logo}
              alt={item.ins_name}
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>
          
          {item.cgpa && (
            <div className="relative">
               <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
               />
               <div className="relative px-4 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-bold tracking-tight text-primary">CGPA: {item.cgpa} / 4.00</span>
               </div>
            </div>
          )}
        </div>

        {/* Middle Section: Title & Degree */}
        <div className="relative z-10 my-10">
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            {item.certificate_name}
          </h3>
          
          <div className="space-y-4">
             <a
                href={item.ins_web}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xl font-semibold text-muted-foreground hover:text-primary transition-colors group/link"
             >
                <MapPin className="w-5 h-5" />
                <span className="underline-offset-8 group-hover/link:underline">{item.ins_name}</span>
             </a>
             
             <div className="flex items-center gap-4 text-muted-foreground/80 font-medium">
                <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-lg text-sm">
                   <Calendar className="w-4 h-4" />
                   <span>{item.start_date} — {item.end_date}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-lg text-sm">
                   <Globe className="w-4 h-4" />
                   <span>Dhaka, BD</span>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Section: Action */}
        <div className="pt-8 border-t border-border/40 relative z-10">
           <a
              href={item.ins_web}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-3 text-sm font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors"
           >
              University Profile
              <span className="inline-block transition-transform group-hover/btn:translate-x-2">→</span>
           </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
