import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LayoutDashboard, Settings, Layers, Code, User, FileText, Briefcase, Award, GraduationCap, MessagesSquare, CheckSquare } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Feature Toggles", href: "/admin/features", icon: Layers },
    { name: "Platform Stats", href: "/admin/stats", icon: User },
    { name: "Projects", href: "/admin/projects", icon: Code },
    { name: "Skills", href: "/admin/skills", icon: Briefcase },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Achievements", href: "/admin/achievements", icon: Award },
    { name: "Education", href: "/admin/education", icon: GraduationCap },
    { name: "Journey", href: "/admin/journey", icon: CheckSquare },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessagesSquare },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/20">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border/40 bg-secondary/20 flex flex-col h-full">
        <div className="p-6 border-b border-border/40 flex items-center justify-between">
          <Link href="/" className="font-black tracking-tighter text-2xl uppercase text-foreground hover:text-primary transition-colors">
            Admin
          </Link>
          <ThemeToggle />
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <Icon className="size-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}
