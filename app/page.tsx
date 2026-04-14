"use client";

import { useState } from "react";
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
import ProjectsSection from "@/sections/ProjectsSection";

import JourneySection from "@/components/portfolio/Journey";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false); // MUST be false initially so it renders the Preloader on SSR/first load

  const handlePreloaderComplete = () => {
    setPreloaderDone(true);
  };

  return (
    <>
      {!preloaderDone && (
        <Preloader key="preloader" onComplete={handlePreloaderComplete} />
      )}
      <Navbar preloaderDone={preloaderDone} />
      <main>
        <HeroSection preloaderDone={preloaderDone} />
        <SkillsSection />

        <ProblemSolvingSection />
        <GitHubSection />

        <Education />
        <ProjectsSection />
        <JourneySection />

        <BlogsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}

