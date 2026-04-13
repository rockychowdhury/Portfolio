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

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false); // MUST be false initially so it renders the Preloader on SSR/first load

  const handlePreloaderComplete = () => {
    setPreloaderDone(true);
  };

  const sections = [
    { id: "projects", title: "Projects", bgColor: "bg-secondary/50" },
    { id: "education", title: "Educations and Courses", bgColor: "bg-background" },
    { id: "journey", title: "Journey - Timeline", bgColor: "bg-secondary/50" },
    { id: "productivity", title: "Productivity and Time Management", bgColor: "bg-background" },
    { id: "blogs", title: "Blogs", bgColor: "bg-secondary/50" },
    { id: "testimonials", title: "Testimonials", bgColor: "bg-background" },
  ];

  return (
    <>
      {!preloaderDone && (
        <Preloader key="preloader" onComplete={handlePreloaderComplete} />
      )}
      <Navbar preloaderDone={preloaderDone} />
      <main>
        <HeroSection preloaderDone={preloaderDone} />
        <SkillsSection />
        
        {/* Render Problem Solving after Skills/Projects (adjust order later if needed, problem solving was 2nd initially) */}
        <ProblemSolvingSection />
        
        {/* Render GitHub Activity Section */}
        <GitHubSection />

        {sections.map((section) => (
          <SectionWrapper
            key={section.id}
            id={section.id}
            className={`min-h-[60vh] px-6 py-32 md:px-12 lg:px-20 ${section.bgColor}`}
          >
            <div className="mx-auto max-w-[1400px]">
              <h2 className="text-4xl font-light tracking-tight text-foreground md:text-5xl">
                {section.title}
              </h2>
              <div className="mt-12 h-64 w-full rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                {section.title} Section Placeholder
              </div>
            </div>
          </SectionWrapper>
        ))}

        <ContactSection />
      </main>

      {/* Footer Section */}
      <Footer />
    </>
  );
}
