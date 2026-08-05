import type { IconType } from "react-icons";
import {
  SiCss,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFramer,
  SiGit,
  SiGithubactions,
  SiGo,
  SiHtml5,
  SiKubernetes,
  SiMongodb,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedis,
  SiRedux,
  SiSqlite,
  SiTailwindcss,
  SiTerraform,
  SiTypescript,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import { Circle } from "lucide-react";

const siIcons: Record<string, IconType> = {
  SiCss,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFramer,
  SiGit,
  SiGithubactions,
  SiGo,
  SiHtml5,
  SiKubernetes,
  SiMongodb,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedis,
  SiRedux,
  SiSqlite,
  SiTailwindcss,
  SiTerraform,
  SiTypescript,
};

const faIcons: Record<string, IconType> = {
  FaAws,
};

const luIcons: Record<string, IconType> = {
  Circle,
};

export function getIcon(iconName: string, iconGroup: string): IconType | null {
  if (iconGroup === "si") return siIcons[iconName] || null;
  if (iconGroup === "lu") return luIcons[iconName] || null;
  if (iconGroup === "fa") return faIcons[iconName] || null;
  return null;
}
