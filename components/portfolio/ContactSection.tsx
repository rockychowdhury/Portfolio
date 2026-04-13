"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion";
import { Trash2, MapPin, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { FaWhatsapp, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";
import { toast } from "sonner";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactSection() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [currentTime, setCurrentTime] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Live Clock for Dhaka (GMT+6)
  useEffect(() => {
    const timer = setInterval(() => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.message]);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        toast.error(data.error || "Something went wrong.");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (_) {
      setStatus("error");
      toast.error("Failed to send message. Please try again.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleClear = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    toast.info("Form cleared.");
  };

  const socialLinks = [
    { name: "LinkedIn", icon: <FaLinkedin size={20} />, href: "https://linkedin.com/in/rockychowdhury1", color: "hover:bg-[#0077B5]" },
    { name: "GitHub", icon: <FaGithub size={20} />, href: "https://github.com/rockychowdhury", color: "hover:bg-[#333]" },
    { name: "WhatsApp", icon: <FaWhatsapp size={20} />, href: "https://wa.me/+8801700000000", color: "hover:bg-[#25D366]" },
    { name: "YouTube", icon: <FaYoutube size={20} />, href: "https://youtube.com/@rockychowdhury", color: "hover:bg-[#FF0000]" },
  ];

  const subjectPills = ["Job Opportunity", "Freelance Project", "Collaboration", "Just Saying Hi"];

  const placeholderText = `Hi Rocky,

I'm [Name] from [Company/Location]. I'd love to discuss 
[a backend role / a project idea / something else].

[What makes it interesting or what you need]

Looking forward to connecting.`;

  return (
    <section 
      id="contact" 
      className="relative w-full overflow-hidden bg-background px-6 py-32 md:px-12 lg:px-20"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: `40px 40px` 
          }} 
        />
      </div>

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--primary-rgb), 0.05),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-16 lg:flex-row">
          
          {/* Left Side: Text and Info */}
          <div className="flex flex-col flex-1 gap-12">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold uppercase tracking-[0.3em] text-primary"
                >
                  Get in touch
                </motion.span>
                
                {/* Availability Indicator */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Available for opportunities
                </motion.div>
              </div>

              <div className="space-y-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl font-light tracking-tight text-foreground md:text-7xl lg:text-8xl"
                >
                  Got an idea? <br />
                  <span className="text-muted-foreground/30">Let&apos;s engineer it.</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs md:text-sm font-medium italic text-muted-foreground/50 max-w-md"
                >
                  Open to backend roles, freelance projects, and interesting problems.
                </motion.p>
              </div>
            </div>

            <div className="mt-8 space-y-12">
              <div className="space-y-6">
                <div className="group flex items-center gap-6">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary/50 border border-border/50 text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
                    <MapPin size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">Location</p>
                    <div className="flex flex-col">
                      <p className="text-xl font-medium text-foreground">Dhaka, Bangladesh <span className="text-xs font-normal text-muted-foreground/40 ml-2">GMT+6</span></p>
                      <p className="text-xs font-mono text-muted-foreground/60">Currently: {currentTime || "--:-- --"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-[88px] text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                  <span className="text-primary italic">⚡</span> Typically responds within 24 hours
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`group/link flex items-center gap-0 overflow-hidden h-14 rounded-2xl bg-secondary/30 border border-border/50 text-muted-foreground transition-all px-4 ${link.color} hover:text-white hover:pr-6 active:scale-95`}
                    title={link.name}
                  >
                    <div className="flex size-6 items-center justify-center">
                      {link.icon}
                    </div>
                    <motion.span 
                      className="w-0 overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-widest transition-all group-hover/link:w-auto group-hover/link:ml-3"
                    >
                      {link.name}
                    </motion.span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="flex-1 lg:max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative rounded-3xl border border-border/50 bg-secondary/10 p-8 backdrop-blur-sm md:p-12 lg:p-16"
            >
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-6">
                  {/* Floating Label Input: Name */}
                  <div className="group relative">
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder=" "
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="peer w-full border-b border-border/50 bg-transparent pb-4 pt-6 text-lg font-medium outline-none transition-all focus:border-primary"
                    />
                    <label className="absolute left-0 top-6 -z-10 origin-[0] -translate-y-6 scale-75 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary">
                      Your Name
                    </label>
                  </div>

                  {/* Floating Label Input: Email */}
                  <div className="group relative">
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder=" "
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="peer w-full border-b border-border/50 bg-transparent pb-4 pt-6 text-lg font-medium outline-none transition-all focus:border-primary"
                    />
                    <label className="absolute left-0 top-6 -z-10 origin-[0] -translate-y-6 scale-75 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary">
                      Email address
                    </label>
                  </div>

                  {/* Subject Pill Selector */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
                      I&apos;m interested in...
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {subjectPills.map((pill) => (
                        <button
                          key={pill}
                          type="button"
                          onClick={() => setFormData({ ...formData, subject: pill })}
                          className={`rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
                            formData.subject === pill
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border/50 bg-background/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          }`}
                        >
                          {pill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Area */}
                  <div className="group relative space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 transition-colors group-focus-within:text-primary">
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        required
                        ref={textareaRef}
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={placeholderText}
                        maxLength={1000}
                        className="w-full resize-none rounded-2xl border border-border/50 bg-background/50 p-6 text-lg font-medium outline-none transition-all placeholder:text-[10px] md:placeholder:text-xs placeholder:italic placeholder:text-muted-foreground/30 focus:border-primary focus:bg-background"
                      />
                      <div className="absolute bottom-4 right-6 text-[10px] font-mono text-muted-foreground/40">
                        {formData.message.length} / 1000
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    disabled={status === "loading"}
                    type="submit"
                    className={`group relative flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 ${
                      status === "success" 
                        ? "bg-green-600 text-white" 
                        : status === "error" 
                        ? "bg-red-600 text-white" 
                        : "bg-foreground text-background hover:pr-12"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {status === "loading" ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="animate-spin" size={18} />
                          <span>Sending...</span>
                        </motion.div>
                      ) : status === "success" ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 size={18} />
                          <span>Message Sent</span>
                        </motion.div>
                      ) : status === "error" ? (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <AlertCircle size={18} />
                          <span>Failed — Try Again</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <span>Send Message</span>
                          <ArrowRight size={18} className="absolute right-8 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                  <button
                    onClick={handleClear}
                    type="button"
                    className="flex items-center justify-center gap-3 rounded-full border border-border px-8 py-5 text-sm font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
                  >
                    <Trash2 size={18} />
                    <span>Clear</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
