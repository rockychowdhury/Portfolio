"use client";

interface RenderedReadmeProps {
  html: string;
}

export default function RenderedReadme({ html }: RenderedReadmeProps) {
  return (
    <article
      className="readme-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
