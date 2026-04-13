"use client";

import { useEffect, useState } from "react";
import GridBackground from "./GridBackground";
import CenterHeadline from "./CenterHeadline";
import FloatingCloud from "./FloatingCloud";
import TestimonialTicker from "./TestimonialTicker";
import SubmitModal from "./SubmitModal";
import AlertStack, { AlertItem } from "./AlertStack";
import { CheckCircle2, Mail } from "lucide-react";
import { ITestimonial } from "@/lib/db/models/Testimonial";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials/list");
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      }
    };

    fetchTestimonials();
  }, []);

  const addAlert = (alert: AlertItem) => {
    setAlerts((prev) => [...prev, alert]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    }, 5000);
  };

  const handleSuccess = () => {
    // Alert 1: Received
    const id1 = `alert-1-${Date.now()}`;
    addAlert({
      id: id1,
      type: "success",
      message: "Kind words received!",
      submessage: "Your testimonial will go live after a quick review — usually within 24 hours.",
      icon: <CheckCircle2 size={18} />,
    });

    // Alert 2: Email Notification Sent (1.5s delay)
    setTimeout(() => {
      const id2 = `alert-2-${Date.now()}`;
      addAlert({
        id: id2,
        type: "info",
        message: "Notification sent",
        submessage: "Rocky has been notified about your review request.",
        icon: <Mail size={18} />,
      });
    }, 1500);
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Select top 10 for the cloud layout
  const topTestimonials = testimonials.slice(0, 10);

  return (
    <section id="testimonials" className="relative w-full bg-background pt-32 pb-24 overflow-hidden">
      <GridBackground />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-full relative">
          {/* Headline centered between floating columns */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-0 pointer-events-none md:opacity-100">
             {/* This space is reserved for visual balance in the absolute layer */}
          </div>
          
          <div className="relative">
            {/* The spec says cards arrive first, then headline. 
                We handle this via staggered viewport triggers in the sub-components */}
            <FloatingCloud testimonials={topTestimonials} isPaused={isModalOpen} />
            
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <CenterHeadline onLeaveTestimonial={() => setIsModalOpen(true)} />
            </div>
          </div>
        </div>

        {testimonials.length > 0 && <TestimonialTicker testimonials={testimonials} />}
      </div>

      <SubmitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
      />

      <AlertStack alerts={alerts} onDismiss={dismissAlert} />
    </section>
  );
}
