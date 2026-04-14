"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ICertification } from "@/lib/db/models/Certification";
import SectionWrapper from "../SectionWrapper";
import BentoGrid from "./BentoGrid";
import ShowAllButton from "./ShowAllButton";

export default function Education() {
  const [data, setData] = useState<ICertification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  useInView(sectionRef, { once: true, margin: "-10%" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/education?limit=all");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch education data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading && data.length === 0) return null;

  // Initial set: Hero (Education) + 2 Certifications
  const heroItem = data.find(item => item.type === "education");
  const certItems = data.filter(item => item.type === "certification");
  
  const initialCerts = certItems.slice(0, 2);
  const remainingCerts = certItems.slice(2);
  
  const visibleData = showAll 
    ? data 
    : (heroItem ? [heroItem, ...initialCerts] : initialCerts);

  return (
    <SectionWrapper id="education" className="relative py-24 lg:py-40 bg-background overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 lg:mb-32 max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-primary/60" />
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-primary">
              Evolution & Credentials
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[0.9]">
            Education & <br /> 
            <span className="text-muted-foreground font-light">Certifications.</span>
          </h2>
          
          <p className="text-lg text-muted-foreground/80 leading-relaxed font-medium">
            Built in classrooms. <br className="hidden md:block" />
            Proven on platforms.
            <span className="block mt-4 text-sm font-normal italic opacity-60">
              Formal education backed by hands-on certifications from industry platforms.
            </span>
          </p>
        </motion.div>

        {/* Bento Grid Container */}
        <div className="relative" ref={sectionRef}>
          <BentoGrid data={visibleData} />
          
          {/* Show All Trigger */}
          {remainingCerts.length > 0 && (
             <ShowAllButton 
                isExpanded={showAll} 
                onClick={() => {
                  setShowAll(!showAll);
                  if (showAll) {
                    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
                  }
                }} 
                count={remainingCerts.length} 
             />
          )}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </SectionWrapper>
  );
}
