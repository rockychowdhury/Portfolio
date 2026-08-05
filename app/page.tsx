import { getFeatures } from "@/lib/db/data/features";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/sections/Hero";
import SkillsSection from "@/sections/Skills";
import ProblemSolvingSection from "@/sections/ProblemSolving";
import GitHubSection from "@/sections/GitHub";
import Footer from "@/components/layout/Footer";
import ContactSection from "@/sections/Contact";
import TestimonialsSection from "@/sections/Testimonials";
import BlogsSection from "@/sections/Blogs";
import Education from "@/sections/Education";
import AchievementsSection from "@/sections/Achievements";
import ProjectsSection from "@/sections/Projects";
import JourneySection from "@/sections/Journey";
import { PreloaderProvider } from "@/components/layout/PreloaderContext";
import { Suspense } from "react";

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

export default async function Home() {
  // Fetch features on the server (Data Access Layer)
  const features = await getFeatures();
  const activeFeatures = features.filter(f => f.isActive);

  return (
    <PreloaderProvider>
      <Navbar features={activeFeatures} />
      
      <HeroSection />
      
      {activeFeatures.map(f => {
          const Component = sectionMap[f.componentId];
          return Component ? (
            <Suspense key={f._id || f.componentId} fallback={<div className="min-h-[50vh]" />}>
              <Component />
            </Suspense>
          ) : null;
      })}
      
      <Footer />
    </PreloaderProvider>
  );
}
