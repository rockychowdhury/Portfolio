"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Edit2, Trash2, X, MapPin, Briefcase, GraduationCap, Award, Users } from "lucide-react";

export default function JourneyAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>({});

  const fetchItems = () => {
    setLoading(true);
    fetch(`/api/resources/journey`)
      .then((res) => res.json())
      .then((data) => {
        // Sort by startDate descending
        data.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        setItems(data);
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
        description: Array.isArray(item.description) ? item.description.join("\n") : item.description || "",
        startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : ""
      });
    } else {
      setCurrentItem({
        type: "work",
        description: "",
        startDate: new Date().toISOString().split('T')[0]
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
    
    // Process description (split by newline) and startDate
    const payload = {
      ...currentItem,
      description: typeof currentItem.description === "string" 
        ? currentItem.description.split("\n").map((t: string) => t.trim()).filter((t: string) => t) 
        : currentItem.description,
      startDate: currentItem.startDate ? new Date(currentItem.startDate).toISOString() : new Date().toISOString()
    };

    const isNew = !payload._id;
    const url = isNew 
      ? `/api/resources/journey` 
      : `/api/resources/journey/item?id=${payload._id}`;
      
    try {
      await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      closeModal();
      fetchItems();
    } catch (error) {
      console.error("Error saving journey item", error);
      alert("Failed to save item.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this timeline item?")) {
      await fetch(`/api/resources/journey/item?id=${id}`, { method: "DELETE" });
      fetchItems();
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'work': return <Briefcase className="size-4 text-blue-500" />;
      case 'education': return <GraduationCap className="size-4 text-green-500" />;
      case 'leadership': return <Users className="size-4 text-purple-500" />;
      case 'achievement': return <Award className="size-4 text-amber-500" />;
      default: return <MapPin className="size-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'work': return "bg-blue-500/10 text-blue-500";
      case 'education': return "bg-green-500/10 text-green-500";
      case 'leadership': return "bg-purple-500/10 text-purple-500";
      case 'achievement': return "bg-amber-500/10 text-amber-500";
      default: return "bg-secondary text-foreground";
    }
  };

  const countByType = {
    work: items.filter(i => i.type === 'work').length,
    education: items.filter(i => i.type === 'education').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/10 p-4 rounded-xl border border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timeline & Education</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your professional journey, education history, and leadership roles.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-background border border-border/50 px-4 py-2 rounded-lg shadow-sm hidden sm:flex">
             <Briefcase className="size-4 text-blue-500" />
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Work</span>
               <span className="text-lg font-black leading-none mt-1">{countByType.work}</span>
             </div>
          </div>
          <div className="flex items-center gap-2 bg-background border border-border/50 px-4 py-2 rounded-lg shadow-sm hidden sm:flex">
             <GraduationCap className="size-4 text-green-500" />
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Education</span>
               <span className="text-lg font-black leading-none mt-1">{countByType.education}</span>
             </div>
          </div>
          
          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 md:py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm ml-auto md:ml-2 h-full"
          >
            <Plus className="size-4" /> <span className="hidden sm:inline">Add Entry</span>
          </button>
        </div>
      </div>

      <div className="bg-background/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <ul className="divide-y divide-border/50">
          {items.map((item) => (
            <li key={item._id} className="flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background border border-border/50 flex flex-shrink-0 items-center justify-center shadow-sm">
                   {item.icon ? (
                     <img src={item.icon} alt={item.organization} className="w-6 h-6 object-contain" />
                   ) : (
                     getTypeIcon(item.type)
                   )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80">{item.organization}</span> &bull; {item.duration}
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
          {items.length === 0 && (
            <li className="p-8 text-center text-muted-foreground">
              No timeline items found. Add one to get started.
            </li>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-background border border-border/50 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col relative my-8">
            <div className="flex justify-between items-center p-4 border-b border-border/50 bg-secondary/10 shrink-0">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                {currentItem._id ? "Edit Timeline Entry" : "Add New Entry"}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-secondary rounded-full transition-colors"><X className="size-5" /></button>
            </div>
            
            <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <form id="journey-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    Entry Type *
                  </label>
                  <select required value={currentItem.type || "work"} onChange={e => setCurrentItem({...currentItem, type: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                    <option value="work">Work Experience</option>
                    <option value="education">Education</option>
                    <option value="leadership">Leadership & Voluntering</option>
                    <option value="achievement">Achievement / Milestone</option>
                  </select>
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold">Title / Role *</label>
                  <input required value={currentItem.title || ""} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} placeholder="e.g. Senior Software Engineer" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Organization / Institution *</label>
                  <input required value={currentItem.organization || ""} onChange={e => setCurrentItem({...currentItem, organization: e.target.value})} placeholder="e.g. Google, Harvard" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Display Duration *
                    <span className="text-[10px] text-muted-foreground font-normal">e.g. 2021 - Present</span>
                  </label>
                  <input required value={currentItem.duration || ""} onChange={e => setCurrentItem({...currentItem, duration: e.target.value})} placeholder="Jan 2022 - Dec 2023" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Sortable Start Date *
                    <span className="text-[10px] text-muted-foreground font-normal">Used for ordering</span>
                  </label>
                  <input required type="date" value={currentItem.startDate || ""} onChange={e => setCurrentItem({...currentItem, startDate: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Icon URL
                    <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <input type="url" value={currentItem.icon || ""} onChange={e => setCurrentItem({...currentItem, icon: e.target.value})} placeholder="https://..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    Description / Bullet Points
                    <span className="text-[10px] text-muted-foreground font-normal">One point per line</span>
                  </label>
                  <textarea value={currentItem.description || ""} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} placeholder="Led the development of...&#10;Mentored 5 junior developers..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none min-h-[120px]" />
                </div>
                
              </form>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-secondary/5 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg font-medium bg-secondary text-foreground hover:bg-secondary/80 text-sm">Cancel</button>
              <button type="submit" form="journey-form" disabled={saving} className="px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 text-sm disabled:opacity-50">
                {saving ? <Loader2 className="size-4 animate-spin" /> : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
