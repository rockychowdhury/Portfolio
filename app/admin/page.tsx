import connectDB from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";
import Skill from "@/lib/db/models/Skill";
import Blog from "@/lib/db/models/Blog";
import Achievement from "@/lib/db/models/Achievement";
import Feature from "@/lib/db/models/Feature";
import Testimonial from "@/lib/db/models/Testimonial";

import { 
  FolderGit2, 
  Code2, 
  Newspaper, 
  Trophy, 
  LayoutTemplate, 
  MessageSquareQuote, 
  Activity 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();

  const [
    projectsCount,
    skillsCount,
    blogsCount,
    achievementsCount,
    featuresCount,
    testimonialsCount
  ] = await Promise.all([
    Project.countDocuments(),
    Skill.countDocuments(),
    Blog.countDocuments(),
    Achievement.countDocuments(),
    Feature.countDocuments(),
    Testimonial.countDocuments(),
  ]);

  const stats = [
    { label: "Total Projects", value: projectsCount, icon: FolderGit2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Skills", value: skillsCount, icon: Code2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Blogs", value: blogsCount, icon: Newspaper, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Achievements", value: achievementsCount, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "UI Features", value: featuresCount, icon: LayoutTemplate, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Testimonials", value: testimonialsCount, icon: MessageSquareQuote, color: "text-pink-500", bg: "bg-pink-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your portfolio content management system. Here is the current state of your database.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-background/50 p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-5">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`size-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-3xl font-bold tracking-tight mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-border/50 bg-secondary/20 p-6 shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-xl bg-primary/10">
              <Activity className="size-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Status</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-green-500">All systems operational</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
