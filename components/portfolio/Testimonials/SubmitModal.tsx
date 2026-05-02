"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, Star } from "lucide-react";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const relationships = ["Colleague", "Mentor", "Classmate", "Collaborator", "Client"] as const;

export default function SubmitModal({ isOpen, onClose, onSuccess }: SubmitModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    relationship: "" as typeof relationships[number] | "",
    quote: "",
    linkedin_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Optimized auto-resize for textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Use a more stable resize approach to prevent layout thrashing
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [formData.quote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
        setFormData({
          name: "",
          role: "",
          relationship: "",
          quote: "",
          linkedin_url: "",
        });
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border/50 bg-background p-8 shadow-2xl md:p-12"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Leave a Testimonial</h3>
              <p className="text-sm text-muted-foreground mt-2">Share your experience working with me.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Full Name *</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-border/50 bg-secondary/20 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:bg-background"
                    placeholder="E.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Role & Company *</label>
                  <input
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-border/50 bg-secondary/20 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:bg-background"
                    placeholder="E.g. Senior Dev at Google"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Relationship *</label>
                <div className="flex flex-wrap gap-2">
                  {relationships.map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setFormData({ ...formData, relationship: rel })}
                      className={`rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        formData.relationship === rel
                          ? "border-primary bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(var(--primary-rgb),0.3)]"
                          : "border-border/50 bg-secondary/10 text-muted-foreground hover:border-primary/30 hover:bg-secondary/20"
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Testimonial *</label>
                <div className="relative">
                  <textarea
                    required
                    ref={textareaRef}
                    maxLength={300}
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-border/50 bg-secondary/20 p-4 text-sm font-medium outline-none transition-all focus:border-primary/50 focus:bg-background"
                    placeholder="Describe your collaboration..."
                  />
                  <div className="absolute bottom-3 right-4 text-[10px] font-mono text-muted-foreground/30">
                    {formData.quote.length} / 300
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="group relative flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-primary hover:shadow-[0_8px_25px_-5px_rgba(var(--primary-rgb),0.4)] hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span className="relative z-10">Submit Testimonial</span>
                      <CheckCircle2 size={16} className="relative z-10 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
