"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Edit2, Trash2, X, Award, ExternalLink, GraduationCap, FileBadge } from "lucide-react";

export default function CertificationsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>({});

  const fetchItems = () => {
    setLoading(true);
    fetch(`/api/resources/certifications`)
      .then((res) => res.json())
      .then((data) => {
        // Sort by order ascending
        data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setItems(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item?: any) => {
    if (item) {
      setCurrentItem(item);
    } else {
      setCurrentItem({
        type: "certification",
        order: items.length * 10
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
    
    const isNew = !currentItem._id;
    const url = isNew 
      ? `/api/resources/certifications` 
      : `/api/resources/certifications/item?id=${currentItem._id}`;
      
    try {
      await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentItem),
      });
      closeModal();
      fetchItems();
    } catch (error) {
      console.error("Error saving certification", error);
      alert("Failed to save certification.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await fetch(`/api/resources/certifications/item?id=${id}`, { method: "DELETE" });
      fetchItems();
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

  const countEducation = items.filter(i => i.type === 'education').length;
  const countCert = items.filter(i => i.type === 'certification').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/10 p-4 rounded-xl border border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Education & Certs</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your academic history and professional certifications.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-background border border-border/50 px-4 py-2 rounded-lg shadow-sm hidden sm:flex">
             <GraduationCap className="size-4 text-green-500" />
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Edu</span>
               <span className="text-lg font-black leading-none mt-1">{countEducation}</span>
             </div>
          </div>
          <div className="flex items-center gap-2 bg-background border border-border/50 px-4 py-2 rounded-lg shadow-sm hidden sm:flex">
             <FileBadge className="size-4 text-amber-500" />
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Certs</span>
               <span className="text-lg font-black leading-none mt-1">{countCert}</span>
             </div>
          </div>
          
          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 md:py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm ml-auto md:ml-2 h-full"
          >
            <Plus className="size-4" /> <span className="hidden sm:inline">Add Record</span>
          </button>
        </div>
      </div>

      <div className="bg-background/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <ul className="divide-y divide-border/50">
          {items.map((item) => (
            <li key={item._id} className="flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-background border border-border/50 flex flex-shrink-0 items-center justify-center shadow-sm overflow-hidden">
                   {item.ins_logo ? (
                     <img src={item.ins_logo} alt={item.ins_name} className="w-full h-full object-cover" />
                   ) : (
                     item.type === 'education' ? <GraduationCap className="size-4 text-green-500" /> : <Award className="size-4 text-amber-500" />
                   )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold ${item.type === 'education' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {item.type}
                    </span>
                    <h3 className="font-semibold text-sm line-clamp-1">{item.certificate_name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground flex gap-2">
                    <span className="font-medium text-foreground/80">{item.ins_name}</span> 
                    {item.issue_date && <span>&bull; Issued {item.issue_date}</span>}
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
              No records found. Add one to get started.
            </li>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-background border border-border/50 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col relative my-8">
            <div className="flex justify-between items-center p-4 border-b border-border/50 bg-secondary/10 shrink-0">
              <h2 className="font-bold text-lg flex items-center gap-2">
                {currentItem.type === 'education' ? <GraduationCap className="size-5 text-green-500" /> : <Award className="size-5 text-amber-500" />}
                {currentItem._id ? "Edit Record" : "Add New Record"}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-secondary rounded-full transition-colors"><X className="size-5" /></button>
            </div>
            
            <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <form id="cert-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    Record Type *
                  </label>
                  <select required value={currentItem.type || "certification"} onChange={e => setCurrentItem({...currentItem, type: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                    <option value="education">Education / Degree</option>
                    <option value="certification">Professional Certification</option>
                  </select>
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold">Degree or Certificate Name *</label>
                  <input required value={currentItem.certificate_name || ""} onChange={e => setCurrentItem({...currentItem, certificate_name: e.target.value})} placeholder="e.g. B.Sc. Computer Science" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Institution Name *</label>
                  <input required value={currentItem.ins_name || ""} onChange={e => setCurrentItem({...currentItem, ins_name: e.target.value})} placeholder="e.g. Stanford University" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Sort Order *
                    <span className="text-[10px] text-muted-foreground font-normal">Lower numbers show first</span>
                  </label>
                  <input required type="number" value={currentItem.order || 0} onChange={e => setCurrentItem({...currentItem, order: parseInt(e.target.value) || 0})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Start Date
                    <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <input value={currentItem.start_date || ""} onChange={e => setCurrentItem({...currentItem, start_date: e.target.value})} placeholder="e.g. 2018" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    End Date / Expected
                    <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <input value={currentItem.end_date || ""} onChange={e => setCurrentItem({...currentItem, end_date: e.target.value})} placeholder="e.g. 2022" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Issue Date
                    <span className="text-[10px] text-muted-foreground font-normal">For certifications</span>
                  </label>
                  <input value={currentItem.issue_date || ""} onChange={e => setCurrentItem({...currentItem, issue_date: e.target.value})} placeholder="e.g. Aug 2024" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    CGPA / Grade
                    <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <input value={currentItem.cgpa || ""} onChange={e => setCurrentItem({...currentItem, cgpa: e.target.value})} placeholder="e.g. 3.9/4.0" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    Description
                    <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <textarea value={currentItem.description || ""} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} placeholder="Relevant coursework, honors, etc..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none min-h-[80px]" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    Verification / Certificate Link
                    <span className="text-[10px] text-muted-foreground font-normal">Optional URL</span>
                  </label>
                  <input type="url" value={currentItem.certificate_link || ""} onChange={e => setCurrentItem({...currentItem, certificate_link: e.target.value})} placeholder="https://..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    Preview Link / Image
                    <span className="text-[10px] text-muted-foreground font-normal">Optional URL</span>
                  </label>
                  <input type="url" value={currentItem.preview_link || ""} onChange={e => setCurrentItem({...currentItem, preview_link: e.target.value})} placeholder="https://..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Institution Logo URL
                    <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <input type="url" value={currentItem.ins_logo || ""} onChange={e => setCurrentItem({...currentItem, ins_logo: e.target.value})} placeholder="https://..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Institution Website
                    <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <input type="url" value={currentItem.ins_web || ""} onChange={e => setCurrentItem({...currentItem, ins_web: e.target.value})} placeholder="https://..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
              </form>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-secondary/5 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg font-medium bg-secondary text-foreground hover:bg-secondary/80 text-sm">Cancel</button>
              <button type="submit" form="cert-form" disabled={saving} className="px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 text-sm disabled:opacity-50">
                {saving ? <Loader2 className="size-4 animate-spin" /> : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
