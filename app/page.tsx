"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import SectionWrapper from "@/components/portfolio/SectionWrapper";
import Preloader from "@/components/portfolio/Preloader";
import ProblemSolvingSection from "@/components/portfolio/ProblemSolving";
import GitHubSection from "@/components/portfolio/GitHub";
import Footer from "@/components/portfolio/Footer";
import ContactSection from "@/components/portfolio/ContactSection";
import TestimonialsSection from "@/components/portfolio/Testimonials";
import BlogsSection from "@/components/portfolio/Blogs";
import Education from "@/components/portfolio/Education";
import AchievementsSection from "@/components/portfolio/AchievementsSection";
import ProjectsSection from "@/sections/ProjectsSection";
import JourneySection from "@/components/portfolio/Journey";

const sectionMap: Record<string, React.ElementType> = {
  skills: SkillsSection,
  projects: ProjectsSection,
  problemsolving: ProblemSolvingSection,
  github: GitHubSection,
  education: Education,
  blogs: BlogsSection,
  achievements: AchievementsSection,
  journey: JourneySection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
};

let hasRunPreloader = false;

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(hasRunPreloader);
  const [features, setFeatures] = useState<any[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);

  useEffect(() => {
    fetch("/api/features")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFeatures(data);
        setLoadingFeatures(false);
      })
      .catch(err => {
        console.error("Failed to load features:", err);
        setLoadingFeatures(false);
      });
  }, []);

  const handlePreloaderComplete = () => {
    hasRunPreloader = true;
    setPreloaderDone(true);
  };

  useEffect(() => {
    // Prevent the browser from trying to restore previous scroll position
    // which causes it to jump to the footer when dynamic content loads
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    if (preloaderDone && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Wait a small bit for any final layout shifts (like hydration)
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [preloaderDone]);

  return (
    <>
      {!preloaderDone && (
        <Preloader key="preloader" onComplete={handlePreloaderComplete} />
      )}
      <Navbar preloaderDone={preloaderDone} features={features} />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={preloaderDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className={!preloaderDone ? "pointer-events-none" : ""}
      >
        <HeroSection preloaderDone={preloaderDone} />
        {!loadingFeatures ? (
            features.filter(f => f.isActive).map(f => {
                const Component = sectionMap[f.componentId];
                return Component ? <Component key={f._id || f.componentId} /> : null;
            })
        ) : (
            <div className="min-h-screen" />
        )}
        <Footer />
      </motion.main>
    </>
  );
}

