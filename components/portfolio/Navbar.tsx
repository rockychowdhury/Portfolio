"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, X, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Blogs", href: "#blogs" },
  { label: "Contact", href: "#contact" },
];

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const moreLinks = [
  { label: "Problem Solving", href: "#problem-solving" },
  { label: "Open Source", href: "#github" },
  { label: "Journey", href: "#journey" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Achievements", href: "#achievements" },
];

export default function Navbar({ preloaderDone = true }: { preloaderDone?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [copied, setCopied] = useState(false);

  const email = process.env.NEXT_PUBLIC_USER_EMAIL || "rocky20809@gmail.com";
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || "/resume.pdf";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", handleScroll);
    
    // Intersection Observer for active section
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const allLinks = [...navLinks, ...moreLinks];
    allLinks.forEach((link) => {
      const element = document.getElementById(link.href.replace("#", ""));
      if (element) observer.observe(element);
    });
    
    // Observe hero section to reset active state when scrolling to top
    const heroElement = document.getElementById("hero");
    if (heroElement) observer.observe(heroElement);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setShowMore(false);
    setIsOpen(false);
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "top-4 mx-auto w-[95%] lg:w-[90%] max-w-[1400px] rounded-full border border-border/40 bg-background/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-2 py-2"
          : "bg-transparent py-5"
      }`}
    >
      <nav className={`flex w-full max-w-[1400px] mx-auto items-center justify-between transition-all duration-500 ${scrolled ? 'px-4' : 'px-4 xs:px-6 md:px-12 lg:px-20'}`}>
        <div className="flex items-center gap-10">
          {/* Logo — anchor for preloader morph target */}
          <Link 
            href="#hero" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center"
          >
            <span
              id="navbar-logo-anchor"
              className={`text-xl font-black uppercase tracking-tighter text-foreground ${
                preloaderDone ? "opacity-100" : "opacity-0"
              }`}
            >
              ROCKY
            </span>
          </Link>

          {/* Desktop Nav with Sliding Pill */}
          <div className="hidden items-center gap-1 lg:flex bg-secondary/20 p-1 rounded-full relative">
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className={`relative z-10 px-4 py-1.5 text-[13px] font-medium tracking-tight transition-colors duration-300 opacity-0 ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    animation: preloaderDone ? `fadeUp 400ms ease ${400 + i * 60}ms forwards` : "none",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 z-[-1] rounded-full bg-background border border-border/50 shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </a>
              );
            })}
            
            {/* More Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowMore(true)}
              onMouseLeave={() => setShowMore(false)}
            >
              <button 
                className={`relative z-10 px-4 py-1.5 text-[13px] font-medium tracking-tight transition-colors duration-300 opacity-0 flex items-center gap-1 ${
                  moreLinks.some(l => activeSection === l.href.replace("#", "")) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                style={{
                  animation: preloaderDone ? `fadeUp 400ms ease ${400 + navLinks.length * 60}ms forwards` : "none",
                }}
              >
                More
                <svg className={`w-3 h-3 transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {moreLinks.some(l => activeSection === l.href.replace("#", "")) && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 z-[-1] rounded-full bg-background border border-border/50 shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
              
              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-48 bg-background/90 backdrop-blur-xl border border-border/50 rounded-2xl p-2 shadow-2xl overflow-hidden"
                  >
                    {moreLinks.map((link) => {
                      const isActive = activeSection === link.href.replace("#", "");
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          onClick={(e) => handleScroll(e, link.href)}
                          className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                            isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          }`}
                        >
                          {link.label}
                        </a>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Global Styles for the new animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(-8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}} />

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          {/* Email Section */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 border border-border/30">
            <span className="text-xs font-medium text-muted-foreground">{email}</span>
            <button
              onClick={copyEmail}
              className="relative flex items-center justify-center p-1.5 rounded-full hover:bg-background transition-colors"
              title="Copy Email"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <Check className="size-3 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <Copy className="size-3 text-muted-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center h-10 px-4 rounded-full bg-background border border-border/50 text-foreground transition-all hover:bg-secondary hover:shadow-md"
              title="Download Resume"
            >
              <Download className="size-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">Resume</span>
            </a>

            <a
              href="https://linkedin.com/in/rockychowdhury1"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center h-10 px-4 rounded-full bg-foreground text-background transition-all hover:opacity-90 hover:shadow-lg shadow-black/10"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="size-4 mr-2 group-hover:rotate-[360deg] transition-transform duration-500" />
              <span className="text-xs font-semibold">LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center rounded-full bg-secondary w-10 h-10 text-foreground transition-all hover:bg-secondary/80 border border-border/50"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-2 px-6 py-8 h-full overflow-y-auto">
              {[...navLinks, ...moreLinks].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className={`flex items-center justify-between group rounded-2xl px-5 py-4 text-base font-medium transition-all ${
                    activeSection === link.href.replace("#", "") 
                      ? "bg-secondary text-foreground" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  {link.label}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </a>
              ))}
              
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/40">
                  <span className="text-xs font-medium text-muted-foreground truncate mr-2">{email}</span>
                  <button onClick={copyEmail} className="p-2 rounded-full bg-background shadow-sm">
                    {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <a href={resumeUrl} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-background border border-border/50 text-sm font-semibold">
                    <Download className="size-4" /> Resume
                  </a>
                  <a href="https://linkedin.com/in/rockychowdhury1" className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-foreground text-background text-sm font-semibold">
                    <LinkedinIcon className="size-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
