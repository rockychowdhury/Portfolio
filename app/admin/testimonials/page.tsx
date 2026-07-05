"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Trash2, X, CheckCircle, Mail, ExternalLink, Calendar } from "lucide-react";

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>({});

  const fetchItems = () => {
    setLoading(true);
    fetch(`/api/resources/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item: any) => {
    setCurrentItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const toggleApproval = async () => {
    setSaving(true);
    const newApprovalState = !currentItem.is_approved;
    const payload = {
      is_approved: newApprovalState,
      approved_at: newApprovalState ? new Date().toISOString() : null,
    };

    try {
      await fetch(`/api/resources/testimonials/item?id=${currentItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setCurrentItem((prev: any) => ({ ...prev, ...payload }));
      fetchItems(); // refresh list in background
    } catch (error) {
      console.error("Error updating testimonial status", error);
      alert("Failed to update status.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this testimonial?")) {
      await fetch(`/api/resources/testimonials/item?id=${id}`, { method: "DELETE" });
      if (isModalOpen && currentItem._id === id) closeModal();
      fetchItems();
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

  const approvedCount = testimonials.filter(t => t.is_approved).length;
  const pendingCount = testimonials.filter(t => !t.is_approved).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/10 p-4 rounded-xl border border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonial Inbox</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review incoming recommendations and approve them for your public portfolio.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background border border-border/50 px-4 py-2 rounded-lg shadow-sm">
            <CheckCircle className="size-4 text-green-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Approved</span>
              <span className="text-lg font-black leading-none mt-1">{approvedCount}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-background border border-border/50 px-4 py-2 rounded-lg shadow-sm">
            <Mail className="size-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Pending</span>
              <span className="text-lg font-black leading-none mt-1">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <ul className="divide-y divide-border/50">
          {testimonials.map((item) => (
            <li 
              key={item._id} 
              onClick={() => openModal(item)}
              className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-border/50" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground border border-border/50">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  {item.is_approved ? (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-background">
                      <CheckCircle className="size-3" />
                    </div>
                  ) : (
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border-2 border-background">
                      <Mail className="size-3" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {item.name}
                    {!item.is_approved && <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider">New Request</span>}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                    {item.role} &bull; {item.relationship}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground hidden md:block">
                  {new Date(item.submitted_at).toLocaleDateString()}
                </span>
                <button 
                  onClick={(e) => handleDelete(item._id, e)} 
                  className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
          {testimonials.length === 0 && (
            <li className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Mail className="size-8 opacity-20" />
              <p>Your inbox is empty. No testimonials found.</p>
            </li>
          )}
        </ul>
      </div>

      {/* Email-style Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-background border border-border/50 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col relative my-8">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-border/50 bg-secondary/10 shrink-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Mail className="size-4" />
                Testimonial Review
              </div>
              <button onClick={closeModal} className="p-1 hover:bg-secondary rounded-full transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            {/* Email Body */}
            <div className="p-6 md:p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              
              <div className="flex items-start justify-between border-b border-border/30 pb-6 mb-6">
                <div className="flex gap-4 items-center">
                  {currentItem.avatar_url ? (
                    <img src={currentItem.avatar_url} alt={currentItem.name} className="w-14 h-14 rounded-full object-cover shadow-sm border border-border/50" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground border border-border/50 shadow-sm">
                      {currentItem.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{currentItem.name}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{currentItem.role}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] font-medium bg-secondary px-2 py-0.5 rounded uppercase tracking-wider text-muted-foreground">{currentItem.relationship}</span>
                      <span className="text-[10px] font-medium bg-secondary px-2 py-0.5 rounded uppercase tracking-wider text-muted-foreground">{currentItem.platform}</span>
                    </div>
                  </div>
                </div>
                
                {currentItem.linkedin_url && (
                  <a href={currentItem.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold">
                    <ExternalLink className="size-3.5" /> Profile
                  </a>
                )}
              </div>

              <div className="bg-secondary/10 p-6 rounded-xl border border-border/30 relative">
                <div className="absolute top-4 left-4 text-4xl text-muted-foreground/20 font-serif leading-none">"</div>
                <p className="text-base leading-relaxed text-foreground/90 relative z-10 pt-2 whitespace-pre-wrap font-serif">
                  {currentItem.quote}
                </p>
              </div>

              <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-muted-foreground border-t border-border/30 pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5" />
                  Submitted: {new Date(currentItem.submitted_at).toLocaleString()}
                </div>
                {currentItem.approved_at && currentItem.is_approved && (
                  <div className="flex items-center gap-2 text-green-500/80">
                    <CheckCircle className="size-3.5" />
                    Approved: {new Date(currentItem.approved_at).toLocaleString()}
                  </div>
                )}
              </div>

            </div>
            
            {/* Action Footer */}
            <div className="p-4 border-t border-border/50 bg-secondary/5 flex justify-between gap-3 shrink-0">
              <button 
                onClick={() => handleDelete(currentItem._id)} 
                className="px-4 py-2 rounded-lg font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-2 text-sm transition-colors"
              >
                <Trash2 className="size-4" /> Delete
              </button>
              
              <div className="flex gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg font-medium bg-secondary text-foreground hover:bg-secondary/80 text-sm">Close</button>
                <button 
                  onClick={toggleApproval} 
                  disabled={saving} 
                  className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors disabled:opacity-50 ${
                    currentItem.is_approved 
                      ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" 
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : currentItem.is_approved ? 'Revoke Approval' : 'Approve for Portfolio'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
