"use client";

import ProjectNavbar from "./ProjectNavbar";
import Footer from "@/components/portfolio/Footer";

export default function ProjectDetailShell({
  projectTitle,
  children,
}: {
  projectTitle: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <ProjectNavbar projectTitle={projectTitle} />
      {children}
      <Footer />
    </>
  );
}
