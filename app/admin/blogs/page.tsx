"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Edit2, Trash2, X, ExternalLink, Star, FileText } from "lucide-react";

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>({});

  const fetchItems = () => {
    setLoading(true);
    fetch(`/api/resources/blogs`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (blog?: any) => {
    if (blog) {
      setCurrentItem({
        ...blog,
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      });
    } else {
      setCurrentItem({
        platform: "LinkedIn",
        etr: 5,
        is_featured: false,
        is_approved: true,
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
    
    // Process tags
    const payload = {
      ...currentItem,
      tags: typeof currentItem.tags === "string" 
        ? currentItem.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t) 
        : currentItem.tags
    };

    const isNew = !payload._id;
    const url = isNew 
      ? `/api/resources/blogs` 
      : `/api/resources/blogs/item?id=${payload._id}`;
      
    try {
      await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      closeModal();
      fetchItems();
    } catch (error) {
      console.error("Error saving blog", error);
      alert("Failed to save blog.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      await fetch(`/api/resources/blogs/item?id=${id}`, { method: "DELETE" });
      fetchItems();
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

  const featuredCount = blogs.filter(b => b.is_featured).length;
  const standardCount = blogs.filter(b => !b.is_featured).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/10 p-4 rounded-xl border border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your articles, publications, and videos.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-background border border-border/50 px-4 py-2 rounded-lg shadow-sm">
            <Star className="size-4 text-amber-500 fill-amber-500/20" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Featured</span>
              <span className="text-lg font-black leading-none mt-1">{featuredCount}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-background border border-border/50 px-4 py-2 rounded-lg shadow-sm">
            <FileText className="size-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Standard</span>
              <span className="text-lg font-black leading-none mt-1">{standardCount}</span>
            </div>
          </div>

          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 md:py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors ml-auto md:ml-2 h-full shadow-sm"
          >
            <Plus className="size-4" /> <span className="hidden sm:inline">Add Blog</span>
          </button>
        </div>
      </div>

      <div className="bg-background/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <ul className="divide-y divide-border/50">
          {blogs.map((blog) => (
            <li key={blog._id} className="flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                  blog.platform === 'YouTube' ? 'bg-red-500/10 text-red-500' :
                  blog.platform === 'LinkedIn' ? 'bg-blue-500/10 text-blue-500' :
                  blog.platform === 'Medium' ? 'bg-foreground/10 text-foreground' :
                  'bg-primary/10 text-primary'
                }`}>
                  {blog.platform}
                </span>
                <h3 className="font-semibold text-sm line-clamp-1">{blog.title}</h3>
                {!blog.is_approved && (
                  <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-sm">Draft</span>
                )}
                {blog.is_featured && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-sm">Featured</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => openModal(blog)} className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit">
                  <Edit2 className="size-4" />
                </button>
                <button onClick={() => handleDelete(blog._id)} className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
          {blogs.length === 0 && (
            <li className="p-8 text-center text-muted-foreground">
              No blogs found. Add one to get started.
            </li>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-background border border-border/50 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col relative my-8">
            <div className="flex justify-between items-center p-4 border-b border-border/50 bg-secondary/10 shrink-0">
              <h2 className="font-bold text-lg">{currentItem._id ? "Edit Blog" : "Add New Blog"}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-secondary rounded-full transition-colors"><X className="size-5" /></button>
            </div>
            
            <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <form id="blog-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold">Title *</label>
                  <input required value={currentItem.title || ""} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold">Subtitle *</label>
                  <textarea required value={currentItem.subtitle || ""} onChange={e => setCurrentItem({...currentItem, subtitle: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none min-h-[80px] resize-y" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Platform *</label>
                  <select required value={currentItem.platform || "LinkedIn"} onChange={e => setCurrentItem({...currentItem, platform: e.target.value})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none">
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Medium">Medium</option>
                    <option value="Dev.to">Dev.to</option>
                    <option value="Hashnode">Hashnode</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Link / Handle *</label>
                  <input required type="url" value={currentItem.handle || ""} onChange={e => setCurrentItem({...currentItem, handle: e.target.value})} placeholder="https://..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold">Thumbnail URL</label>
                  <input type="url" value={currentItem.thumbnail_url || ""} onChange={e => setCurrentItem({...currentItem, thumbnail_url: e.target.value})} placeholder="https://..." className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold flex justify-between">
                    Tags
                    <span className="text-[10px] text-muted-foreground font-normal">Comma separated</span>
                  </label>
                  <input value={currentItem.tags || ""} onChange={e => setCurrentItem({...currentItem, tags: e.target.value})} placeholder="react, frontend, tutorial" className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex justify-between">
                    Estimated Time to Read (ETR)
                    <span className="text-[10px] text-muted-foreground font-normal">Minutes</span>
                  </label>
                  <input type="number" min="1" required value={currentItem.etr || 5} onChange={e => setCurrentItem({...currentItem, etr: parseInt(e.target.value) || 0})} className="w-full bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="flex items-center gap-2 text-sm font-medium p-2 bg-secondary/10 rounded-lg border border-border/30 cursor-pointer">
                    <input type="checkbox" checked={currentItem.is_featured || false} onChange={e => setCurrentItem({...currentItem, is_featured: e.target.checked})} className="size-4" />
                    Featured Blog
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium p-2 bg-secondary/10 rounded-lg border border-border/30 cursor-pointer">
                    <input type="checkbox" checked={currentItem.is_approved ?? true} onChange={e => setCurrentItem({...currentItem, is_approved: e.target.checked})} className="size-4" />
                    Approved (Visible)
                  </label>
                </div>
                
              </form>
            </div>
            
            <div className="p-4 border-t border-border/50 bg-secondary/5 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg font-medium bg-secondary text-foreground hover:bg-secondary/80 text-sm">Cancel</button>
              <button type="submit" form="blog-form" disabled={saving} className="px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 text-sm disabled:opacity-50">
                {saving ? <Loader2 className="size-4 animate-spin" /> : 'Save Blog'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
