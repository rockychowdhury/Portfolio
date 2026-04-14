"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { ICertification } from "@/lib/db/models/Certification";

function TimelineNode({ isEducation }: { isEducation: boolean }) {
  return (
    <div className="absolute left-[3px] md:left-[11px] top-6 w-3 h-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background shadow-sm z-10 flex items-center justify-center">
      {isEducation && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
    </div>
  );
}

function CertificationCard({
  item,
  index,
  total,
}: {
  item: ICertification;
  index: number;
  total: number;
}) {
  const isEducation = item.type === "education";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
      className="relative pl-6 md:pl-12 pb-10"
    >
      {/* Timeline Node & Connector */}
      <TimelineNode isEducation={isEducation} />
      <div className="absolute left-[3px] md:left-[11px] top-6 w-4 md:w-6 h-px bg-border/50" />

      {/* Card Content */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={`relative flex flex-col md:flex-row gap-5 p-5 md:p-6 rounded-2xl border bg-card transition-shadow hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)]
          ${
            isEducation
              ? "border-l-4 border-l-foreground/30 border-y-border border-r-border bg-secondary/10"
              : "border-border"
          }
        `}
      >
        {/* Left: Preview logic */}
        <div className="shrink-0 w-full md:w-48 aspect-video md:aspect-auto md:h-32 bg-secondary/30 rounded-xl overflow-hidden border border-border/50 flex items-center justify-center group relative">
          {item.preview_link ? (
            <img
              src={item.preview_link}
              alt={item.certificate_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <img
              src={item.ins_logo}
              alt={item.ins_name}
              className="w-16 h-16 object-contain opacity-50 grayscale mix-blend-multiply dark:mix-blend-screen transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
              loading="lazy"
            />
          )}

          {/* Education badge overlay if it's the logo preview fallback */}
          {isEducation && !item.preview_link && (
            <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-300" />
          )}
        </div>

        {/* Right: Content details */}
        <div className="flex-1 flex flex-col justify-between pt-1 md:pt-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img
                src={item.ins_logo}
                alt={`${item.ins_name} logo`}
                className="w-4 h-4 object-contain rounded-sm"
              />
              <a
                href={item.ins_web}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-2"
              >
                {item.ins_name}
              </a>
            </div>

            <h3 className="text-lg font-semibold text-foreground leading-tight tracking-tight mb-2">
              {item.certificate_name}
            </h3>

            {item.description && item.description !== "N/A" && (
              <p className="text-sm text-muted-foreground line-clamp-2 max-w-[90%] mb-4">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 md:mt-0 pt-4 md:pt-2 border-t border-border/40 md:border-t-0 md:border-none">
            {/* Date logic */}
            <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground/80 bg-secondary/50 px-2 py-1 rounded-md border border-border/50">
              {isEducation
                ? `${item.start_date} — ${item.end_date}`
                : `Issued: ${item.issue_date}`}
            </span>

            {/* CGPA Badge */}
            {item.cgpa && item.cgpa !== "N/A" && (
              <span className="text-[11px] font-bold tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                CGPA: {item.cgpa}
              </span>
            )}

            <div className="flex-1" />

            {/* Link logic */}
            {item.certificate_link && item.certificate_link !== "N/A" && (
              <a
                href={item.certificate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
              >
                View {!isEducation ? "Certificate" : "Details"}
                <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CertificationsSection() {
  const [data, setData] = useState<ICertification[]>([]);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px -10% 0px" });

  useEffect(() => {
    fetch("/api/certifications")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((e) => console.error(e));
  }, []);

  if (!data || data.length === 0) return null;

  // Initial list is top 3 by order. Expanded list is all (sorted by order logic preserved from API or fallback logic).
  const visibleData = showAll ? data : data.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      id="education"
      className="relative w-full bg-background py-24 md:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-[1000px] px-6 md:px-12 lg:px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16"
        >
          <span className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-3 block">
            {data.length} Credentials
          </span>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Education &amp; Certifications
          </h2>
        </motion.div>

        <div className="relative">
          {/* Main vertical Timeline Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="absolute left-[3px] md:left-[11px] top-4 bottom-10 w-px bg-border/40 origin-top"
          />

          <AnimatePresence mode="popLayout" initial={false}>
            {visibleData.map((item, i) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              >
                <CertificationCard item={item} index={i} total={visibleData.length} />
              </motion.div>
            ))}
          </AnimatePresence>

          {data.length > 3 && (
            <motion.div layout className="pt-4 pl-6 md:pl-12">
              <button
                onClick={() => setShowAll(!showAll)}
                className="group flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 rounded-xl border border-border bg-secondary/20 font-medium text-sm text-foreground hover:bg-secondary/40 hover:border-border/80 transition-all font-mono tracking-tight"
              >
                {showAll ? "Show Less" : "Show All"}
                <motion.div
                  animate={{ rotate: showAll ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                </motion.div>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
