"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Edit2, Trash2, X } from "lucide-react";
import { getIcon } from "@/lib/iconRegistry";

function AdminIcon({ iconName, iconGroup, className, style }: {
  iconName: string;
  iconGroup: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (() => {
    const Icon = getIcon(iconName, iconGroup);
    if (!Icon) {
      return (
        <span className="text-xs text-muted-foreground" style={style}>?</span>
      );
    }
    return <Icon className={className} style={style} />;
  })();
}

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>({});

  const [filterGroup, setFilterGroup] = useState<string>("all");

  const fetchItems = () => {
    setLoading(true);
    fetch(`/api/resources/skills`)
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (skill?: any) => {
    setCurrentItem(skill || { icon_type: "icon", icon_group: "si", group: "frontend", order: 0, is_top_skill: false });
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
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
      ? `/api/resources/skills` 
      : `/api/resources/skills/item?id=${currentItem._id}`;
      
    await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentItem),
    });
    
    setSaving(false);
    closeModal();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      await fetch(`/api/resources/skills/item?id=${id}`, { method: "DELETE" });
      fetchItems();
    }
  };

  // Preview Icon Component for the form
  const previewIcon = currentItem.icon;
  const previewGroup = currentItem.icon_group;

  const filteredSkills = filterGroup === "all" ? skills : skills.filter((s) => s.group === filterGroup);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Skills Manager</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 flex-1 sm:flex-none min-w-[150px]"
          >
            <option value="all">All Groups</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="devops">DevOps</option>
            <option value="database">Database</option>
            <option value="cs-fundamentals">CS Fundamentals</option>
            <option value="tools">Tools</option>
          </select>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            <Plus className="size-4" /> Add Skill
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredSkills.map((skill) => {
            return (
              <div key={skill._id} className="relative group bg-background/50 border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-primary/50 transition-all overflow-hidden">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 backdrop-blur-md rounded-md border border-border/50 p-1">
                  <button onClick={() => openModal(skill)} className="p-1 hover:text-primary transition-colors"><Edit2 className="size-3" /></button>
                  <button onClick={() => handleDelete(skill._id)} className="p-1 hover:text-red-500 transition-colors"><Trash2 className="size-3" /></button>
                </div>
                
                <div className="w-12 h-12 flex items-center justify-center mb-3 rounded-lg bg-secondary/20">
                  {skill.icon_type === "text" ? (
                    <span className="font-bold text-lg" style={{ color: skill.color }}>{skill.icon}</span>
                  ) : (
                    <AdminIcon iconName={skill.icon} iconGroup={skill.icon_group} className="size-6" style={{ color: skill.color }} />
                  )}
                </div>
                <h3 className="font-semibold text-sm truncate w-full">{skill.name}</h3>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{skill.group}</span>
                {skill.is_top_skill && <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-primary" title="Top Skill"></span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-background border border-border/50 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col relative">
            <div className="flex justify-between items-center p-4 border-b border-border/50 bg-secondary/10">
              <h2 className="font-bold text-lg">{currentItem._id ? "Edit Skill" : "New Skill"}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-secondary rounded-full transition-colors"><X className="size-5" /></button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <form id="skill-form" onSubmit={handleSave} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Skill Name</label>
                    <input required value={currentItem.name || ""} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-1.5 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Brand Color (Hex)</label>
                    <input type="text" placeholder="#FFFFFF" value={currentItem.color || ""} onChange={e => setCurrentItem({...currentItem, color: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-1.5 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,1fr,auto] gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Icon Group</label>
                    <select value={currentItem.icon_group || "si"} onChange={e => setCurrentItem({...currentItem, icon_group: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-1.5 text-sm">
                      <option value="si">SimpleIcons (si)</option>
                      <option value="lu">Lucide (lu)</option>
                      <option value="fa">FontAwesome (fa)</option>
                      <option value="vsc">VSCode (vsc)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Icon Name (e.g. SiReact)</label>
                    <input required value={currentItem.icon || ""} onChange={e => setCurrentItem({...currentItem, icon: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-1.5 text-sm" />
                  </div>
                  <div className="w-10 h-10 rounded-lg border border-border/50 bg-secondary/20 flex items-center justify-center shrink-0 mb-0.5">
                     {currentItem.icon_type === "text" ? (
                       <span className="font-bold text-sm" style={{ color: currentItem.color }}>{currentItem.icon}</span>
                     ) : (
                       <AdminIcon iconName={previewIcon} iconGroup={previewGroup} className="size-5" style={{ color: currentItem.color }} />
                     )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Category</label>
                    <select value={currentItem.group || "frontend"} onChange={e => setCurrentItem({...currentItem, group: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-1.5 text-sm">
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="devops">DevOps</option>
                      <option value="database">Database</option>
                      <option value="cs-fundamentals">CS Fundamentals</option>
                      <option value="tools">Tools</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Icon Type</label>
                    <select value={currentItem.icon_type || "icon"} onChange={e => setCurrentItem({...currentItem, icon_type: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-1.5 text-sm">
                      <option value="icon">Icon Component</option>
                      <option value="text">Text Render</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Description</label>
                  <textarea required value={currentItem.description || ""} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-1.5 text-sm min-h-[60px]" />
                </div>

                <div className="grid grid-cols-2 gap-4 bg-secondary/10 p-3 rounded-xl border border-border/30">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={currentItem.is_top_skill || false} onChange={e => setCurrentItem({...currentItem, is_top_skill: e.target.checked})} className="size-4" />
                    Mark as Top Skill
                  </label>
                  {currentItem.is_top_skill && (
                    <div className="space-y-1 flex items-center gap-2">
                      <label className="text-xs font-semibold shrink-0">Sort Order:</label>
                      <input type="number" value={currentItem.order ?? ""} onChange={e => setCurrentItem({...currentItem, order: e.target.value === "" ? "" : Number(e.target.value)})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-2 py-1 text-sm" />
                    </div>
                  )}
                </div>

              </form>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-background flex justify-end gap-3 mt-auto">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg font-medium bg-secondary text-foreground hover:bg-secondary/80 text-sm">Cancel</button>
              <button type="submit" form="skill-form" disabled={saving} className="px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 text-sm disabled:opacity-50">
                {saving ? <Loader2 className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick component for save icon to prevent importing unnecessarily
function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  );
}
