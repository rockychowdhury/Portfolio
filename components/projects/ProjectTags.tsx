// components/projects/ProjectTags.tsx
import clsx from "clsx";

interface ProjectTagsProps {
  skills: string[];
  className?: string;
  active?: boolean;
}

export function ProjectTags({ skills, className, active }: ProjectTagsProps) {
  return (
    <div className={clsx("flex flex-wrap gap-2", className)}>
      {skills.map((skill) => (
        <span
          key={skill}
          className={clsx(
            "px-3 py-1 text-[10px] font-mono rounded-full border transition-all duration-500",
            active 
              ? "bg-foreground/10 border-foreground/20 text-foreground/80" 
              : "bg-foreground/5 border-foreground/5 text-foreground/20"
          )}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
