export type Achievement = {
  _id: string;
  category:
    | "education"
    | "certification"
    | "competitive_programming"
    | "project"
    | "academic_honor"
    | "leadership";
  title: string;
  organization: string;
  date: string;           // ISO string or formatted string
  details?: Record<string, string | number>;
  tags?: string[];
};

// Category → display config
export const CATEGORY_META: Record<
  Achievement["category"],
  { label: string; color: string; bg: string; iconName: string }
> = {
  education:               { label: "Education",       color: "#185FA5", bg: "#E6F1FB", iconName: "GraduationCap" },
  certification:           { label: "Certification",   color: "#0F6E56", bg: "#E1F5EE", iconName: "BadgeCheck"    },
  competitive_programming: { label: "Competitive",     color: "#993C1D", bg: "#FAECE7", iconName: "Trophy"        },
  project:                 { label: "Project",         color: "#534AB7", bg: "#EEEDFE", iconName: "Code2"         },
  academic_honor:          { label: "Honor",           color: "#854F0B", bg: "#FAEEDA", iconName: "Star"          },
  leadership:              { label: "Leadership",      color: "#3B6D11", bg: "#EAF3DE", iconName: "Users"         },
};
