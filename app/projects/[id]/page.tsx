import { notFound } from "next/navigation";
import connectDB from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";
import { fetchReadme } from "@/lib/fetchReadme";
import { processMarkdown } from "@/lib/processMarkdown";
import DetailLayout from "@/components/ProjectDetail/DetailLayout";
import DetailHeroVideo from "@/components/ProjectDetail/DetailHeroVideo";
import DetailCTARow from "@/components/ProjectDetail/DetailCTARow";
import ProjectDetailShell from "@/components/ProjectDetail/ProjectDetailShell";

import type { Metadata } from "next";

// ISR: revalidate every 24 hours
export const revalidate = 86400;

// Pre-render all project detail pages at build time
export async function generateStaticParams() {
  try {
    await connectDB();
    const projects = await Project.find({}, { _id: 1 }).lean();
    return projects.map((p: any) => ({
      id: p._id.toString(),
    }));
  } catch {
    return [];
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    await connectDB();
    const project = await Project.findById(id).lean();

    if (!project) {
      return { title: "Project Not Found" };
    }

    return {
      title: `${(project as any).title} | Rocky Chowdhury`,
      description: (project as any).description,
      openGraph: {
        title: `${(project as any).title} | Rocky Chowdhury`,
        description: (project as any).description,
        type: "article",
        images: [(project as any).thumbnail],
      },
    };
  } catch {
    return { title: "Project | Rocky Chowdhury" };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch project from DB
  await connectDB();
  const projectDoc = await Project.findById(id).lean();

  if (!projectDoc) {
    notFound();
  }

  const project = {
    ...(projectDoc as any),
    id: (projectDoc as any)._id.toString(),
    _id: (projectDoc as any)._id.toString(),
  };

  // Fetch and process README
  let readmeHtml: string | null = null;
  let toc: { text: string; level: number; slug: string }[] = [];

  if (project.readmeLink) {
    const rawMarkdown = await fetchReadme(project.readmeLink);

    if (rawMarkdown) {
      const processed = await processMarkdown(rawMarkdown, project.readmeLink);
      readmeHtml = processed.html;
      toc = processed.toc;
    }
  }

  return (
    <ProjectDetailShell projectTitle={project.title}>
      <div className="min-h-screen bg-background pt-20">
        {/* Hero Video */}
        <DetailHeroVideo
          videoSrc={project.videoPreviewLink}
          thumbnail={project.thumbnail}
          title={project.title}
        />

        {/* CTA Buttons */}
        <DetailCTARow
          githubLink={project.githubLink}
          liveLink={project.liveLink}
          youtubeLink={project.youtubeLink}
        />

        {/* Main Content */}
        <DetailLayout
          readmeHtml={readmeHtml}
          toc={toc}
          project={project}
        />
      </div>
    </ProjectDetailShell>
  );
}

