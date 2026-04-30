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

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = () => {
    setPreloaderDone(true);
  };

  useEffect(() => {
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
      <Navbar preloaderDone={preloaderDone} />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={preloaderDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className={!preloaderDone ? "pointer-events-none" : ""}
      >
        <HeroSection preloaderDone={preloaderDone} />
        <SkillsSection />
        <ProjectsSection />
        <ProblemSolvingSection />
        <GitHubSection />
        <Education />
        <BlogsSection />
        <AchievementsSection />
        <JourneySection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </motion.main>
    </>
  );
}

