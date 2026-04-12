"use client";

import { motion } from "framer-motion";
import { Download, Menu, X, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Blogs", href: "#blogs" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ preloaderDone = true }: { preloaderDone?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 border-b border-border shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="flex w-full items-center justify-between px-6 py-5 md:px-12 lg:px-20">
        <div className="flex items-center gap-12">
          {/* Logo morph target */}
          <Link href="/" className="group flex items-center">
            {preloaderDone ? (
              <motion.span 
                layoutId="brand-logo"
                className="text-xl font-black uppercase tracking-tighter text-foreground"
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              >
                ROCKY
              </motion.span>
            ) : (
              <span className="text-xl font-black uppercase tracking-tighter opacity-0">
                ROCKY
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[14px] font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground opacity-0"
                style={{
                  animation: preloaderDone ? `fadeUp 400ms ease ${400 + i * 60}ms forwards` : "none",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Global Styles for the new animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(-12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}} />

        {/* Desktop Actions */}
        <div className="hidden items-center gap-6 md:flex">
          <ThemeToggle />
          
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground transition-all hover:bg-secondary/80 border border-border"
            title="Download Resume"
          >
            <Download className="size-4" />
          </a>

          <a
            href="https://linkedin.com/in/rockychowdhury1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground transition-all hover:bg-secondary/80 border border-border"
            title="LinkedIn Profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>

          <Link
            href="#contact"
            className="text-[14px] font-semibold tracking-tight text-foreground border-b-2 border-foreground pb-0.5 transition-all hover:opacity-70 flex items-center gap-1"
          >
            Book A Call
            <span className="text-[10px]">↗</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="border-t border-border bg-background px-6 pb-8 pt-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-[14px] font-medium tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-3 text-[14px] font-bold text-foreground underline decoration-2"
            >
              Book A Call ↗
            </Link>
          </div>
          <div className="mt-6 flex gap-4 px-4">
             <a
              href="/resume.pdf"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              <Download className="size-4" /> Resume
            </a>
            <a
              href="https://linkedin.com/in/rockychowdhury1"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
