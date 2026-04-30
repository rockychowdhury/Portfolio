"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function ProjectNavbar({ projectTitle }: { projectTitle: string }) {
  const [scrolled, setScrolled] = useState(false);

  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || "/resume.pdf";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "top-4 mx-auto w-[95%] lg:w-[90%] max-w-[1400px] rounded-full border border-border/40 bg-background/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-2 py-2"
          : "bg-transparent py-5"
      }`}
    >
      <nav
        className={`flex w-full max-w-[1400px] mx-auto items-center justify-between transition-all duration-500 ${
          scrolled ? "px-4" : "px-4 xs:px-6 md:px-12 lg:px-20"
        }`}
      >
        {/* Left — Back button */}
        <div className="flex items-center gap-4">
          <Link
            href="/#projects"
            className="group flex items-center gap-2.5 text-foreground hover:text-foreground/80 transition-colors"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary/40 border border-border/30 group-hover:bg-secondary/70 transition-all duration-200 group-hover:-translate-x-0.5">
              <ArrowLeft className="size-4" />
            </div>
            <span className="hidden sm:inline text-sm font-semibold tracking-tight">
              Back
            </span>
          </Link>

          {/* Project title — visible when scrolled for context */}
          {scrolled && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:inline text-xs font-medium text-muted-foreground/60 tracking-tight truncate max-w-[200px]"
            >
              {projectTitle}
            </motion.span>
          )}
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex group items-center justify-center h-10 px-4 rounded-full bg-background border border-border/50 text-foreground transition-all hover:bg-secondary hover:shadow-md"
            title="Download Resume"
          >
            <Download className="size-4 mr-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Resume</span>
          </a>

          <a
            href="https://linkedin.com/in/rockychowdhury1"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center h-10 px-4 rounded-full bg-foreground text-background transition-all hover:opacity-90 hover:shadow-lg shadow-black/10"
            title="LinkedIn Profile"
          >
            <LinkedinIcon className="size-4 mr-2 group-hover:rotate-[360deg] transition-transform duration-500" />
            <span className="text-xs font-semibold">LinkedIn</span>
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
