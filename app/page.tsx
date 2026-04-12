"use client";

import { useState } from "react";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import SectionWrapper from "@/components/portfolio/SectionWrapper";
import Preloader from "@/components/portfolio/Preloader";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false); // MUST be false initially so it renders the Preloader on SSR/first load

  const handlePreloaderComplete = () => {
    setPreloaderDone(true);
  };

  const sections = [
    { id: "skills", title: "Skills", bgColor: "bg-background" },
    { id: "projects", title: "Projects", bgColor: "bg-secondary/50" },
    { id: "problem-solving", title: "Problem Solving Activities", bgColor: "bg-background" },
    { id: "github-stats", title: "Github Profile Stats", bgColor: "bg-secondary/50" },
    { id: "education", title: "Educations and Courses", bgColor: "bg-background" },
    { id: "journey", title: "Journey - Timeline", bgColor: "bg-secondary/50" },
    { id: "productivity", title: "Productivity and Time Management", bgColor: "bg-background" },
    { id: "blogs", title: "Blogs", bgColor: "bg-secondary/50" },
    { id: "testimonials", title: "Testimonials", bgColor: "bg-background" },
    { id: "contact", title: "Contact", bgColor: "bg-secondary/50" },
  ];

  return (
    <>
      {!preloaderDone && (
        <Preloader key="preloader" onComplete={handlePreloaderComplete} />
      )}
      <Navbar preloaderDone={preloaderDone} />
      <main>
        <HeroSection preloaderDone={preloaderDone} />
        
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
      </main>

      {/* Footer Section */}
      <footer className="border-t border-border bg-background px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rocky Chowdhury. Built with Next.js & Tailwind.
          </p>
          <div className="flex gap-8">
             <a href="#" className="text-sm text-muted-foreground hover:text-foreground">LinkedIn</a>
             <a href="#" className="text-sm text-muted-foreground hover:text-foreground">GitHub</a>
             <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Twitter</a>
          </div>
        </div>
      </footer>
    </>
  );
}
