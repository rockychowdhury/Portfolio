"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Edit2, Trash2, X, Trophy } from "lucide-react";

export default function AchievementsAdmin() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>({});

  const fetchItems = () => {
    setLoading(true);
    fetch(`/api/resources/achievements`)
      .then((res) => res.json())
      .then((data) => {
        // Sort by date_sortable descending
        data.sort((a: any, b: any) => new Date(b.date_sortable).getTime() - new Date(a.date_sortable).getTime());
        setAchievements(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item?: any) => {
    if (item) {
      setCurrentItem({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
        date_sortable: item.date_sortable ? new Date(item.date_sortable).toISOString().split('T')[0] : ""
      });
    } else {
      setCurrentItem({
        category: "Awards",
        strength: 5,
        tags: ""
      });
    }
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Process tags and date_sortable
    const payload = {
      ...currentItem,
      tags: typeof currentItem.tags === "string" 
        ? currentItem.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t) 
        : currentItem.tags,
      date_sortable: currentItem.date_sortable ? new Date(currentItem.date_sortable).toISOString() : new Date().toISOString()
    };

    const isNew = !payload._id;
    const url = isNew 
      ? `/api/resources/achievements` 
      : `/api/resources/achievements/item?id=${payload._id}`;
      
    try {
      await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      closeModal();
      fetchItems();
    } catch (error) {
      console.error("Error saving achievement", error);
      alert("Failed to save achievement.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      await fetch(`/api/resources/achievements/item?id=${id}`, { method: "DELETE" });
      fetchItems();
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/10 p-4 rounded-xl border border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your awards, certifications, and recognitions.
          </p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 md:py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="size-4" /> Add Achievement
        </button>
      </div>

      <div className="bg-background/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <ul className="divide-y divide-border/50">
          {achievements.map((item) => (
            <li key={item._id} className="flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary border border-border/50 flex flex-shrink-0 items-center justify-center overflow-hidden">
                   {item.img_url ? (
                     <img src={item.img_url} alt={item.organization} className="w-full h-full object-cover" />
                   ) : (
                     <Trophy className="size-4 text-muted-foreground" />
                   )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.organization} &bull; {item.date}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => openModal(item)} className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit">
                  <Edit2 className="size-4" />
                </button>
                <button onClick={() => handleDelete(item._id)} className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
          {achievements.length === 0 && (
            <li className="p-8 text-center text-muted-foreground">
              No achievements found. Add one to get started.
            </li>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-background border border-border/50 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col relative my-8">
            <div className="flex justify-between items-center p-4 border-b border-border/50 bg-secondary/10 shrink-0">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Trophy className="size-5 text-amber-500" />
                {currentItem._id ? "Edit Achievement" : "Add New Achievement"}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-secondary rounded-full transition-colors"><X className="size-5" /></button>
            </div>
            
            <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <form id="achievement-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold">Title *</label>
                  <input required value={currentItem.title || ""} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} placeholder="e.g. 1st Place Global Hackathon" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Organization / Issuer *</label>
                  <input required value={currentItem.organization || ""} onChange={e => setCurrentItem({...currentItem, organization: e.target.value})} placeholder="e.g. Google, Harvard" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Category *
                    <span className="text-[10px] text-muted-foreground font-normal">e.g. Award, Certificate</span>
                  </label>
                  <input required value={currentItem.category || ""} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Display Date *
                    <span className="text-[10px] text-muted-foreground font-normal">e.g. Aug 2024</span>
                  </label>
                  <input required value={currentItem.date || ""} onChange={e => setCurrentItem({...currentItem, date: e.target.value})} placeholder="Aug 2024" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Sortable Date *
                    <span className="text-[10px] text-muted-foreground font-normal">Used for ordering</span>
                  </label>
                  <input required type="date" value={currentItem.date_sortable || ""} onChange={e => setCurrentItem({...currentItem, date_sortable: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    Image / Badge URL
                    <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <input type="url" value={currentItem.img_url || ""} onChange={e => setCurrentItem({...currentItem, img_url: e.target.value})} placeholder="https://..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    External Link / Verification Handle
                    <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <input type="url" value={currentItem.handle || ""} onChange={e => setCurrentItem({...currentItem, handle: e.target.value})} placeholder="https://..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    Tags
                    <span className="text-[10px] text-muted-foreground font-normal">Comma separated</span>
                  </label>
                  <input value={currentItem.tags || ""} onChange={e => setCurrentItem({...currentItem, tags: e.target.value})} placeholder="Machine Learning, APIs" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    Strength / Significance (1-5)
                    <span className="text-[10px] text-muted-foreground font-normal">Used for visual emphasis</span>
                  </label>
                  <input type="number" min="1" max="5" value={currentItem.strength || 5} onChange={e => setCurrentItem({...currentItem, strength: parseInt(e.target.value) || 5})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
              </form>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-secondary/5 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg font-medium bg-secondary text-foreground hover:bg-secondary/80 text-sm">Cancel</button>
              <button type="submit" form="achievement-form" disabled={saving} className="px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 text-sm disabled:opacity-50">
                {saving ? <Loader2 className="size-4 animate-spin" /> : 'Save Achievement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
