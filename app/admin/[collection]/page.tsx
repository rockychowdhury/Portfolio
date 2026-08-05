"use client";

import { use, useState, useEffect } from "react";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";

// Schema definitions to build dynamic forms
const SCHEMAS: Record<string, any> = {
  projects: [
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "readmeLink", label: "Readme Link", type: "text" },
    { key: "thumbnail", label: "Thumbnail URL", type: "text" },
    { key: "githubLink", label: "GitHub URL", type: "text" },
    { key: "liveLink", label: "Live URL", type: "text" },
    { key: "videoPreviewLink", label: "Video URL", type: "text" },
    { key: "order", label: "Order", type: "number" },
  ],
  skills: [
    { key: "name", label: "Skill Name", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "icon", label: "Icon ID", type: "text" },
    { key: "group", label: "Group", type: "select", options: ["frontend", "backend", "devops", "database", "cs-fundamentals", "tools"] },
    { key: "is_top_skill", label: "Top Skill", type: "checkbox" },
    { key: "order", label: "Order", type: "number" },
  ],
  blogs: [
    { key: "title", label: "Title", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
    { key: "handle", label: "Slug/Handle", type: "text" },
    { key: "platform", label: "Platform", type: "select", options: ["LinkedIn", "YouTube", "Medium", "Dev.to", "Hashnode"] },
    { key: "thumbnail_url", label: "Thumbnail URL", type: "text" },
    { key: "etr", label: "Estimated Read Time (min)", type: "number" },
    { key: "is_featured", label: "Featured", type: "checkbox" },
    { key: "is_approved", label: "Approved", type: "checkbox" },
  ],
  achievements: [
    { key: "title", label: "Title", type: "text" },
    { key: "organization", label: "Organization", type: "text" },
    { key: "category", label: "Category", type: "select", options: ["education", "certification", "project", "competitive_programming", "academic_honor", "leadership"] },
    { key: "date", label: "Display Date", type: "text" },
    { key: "img_url", label: "Image URL", type: "text" },
    { key: "strength", label: "Strength (1-5)", type: "number" },
  ],
  education: [
    { key: "title", label: "Title / Degree / Cert", type: "text" },
    { key: "issuer", label: "Issuer / Institution", type: "text" },
    { key: "type", label: "Type", type: "select", options: ["education", "certification"] },
    { key: "issue_date", label: "Issue Date", type: "text" },
    { key: "credential_url", label: "Credential URL", type: "text" },
    { key: "image_url", label: "Image URL", type: "text" },
    { key: "order", label: "Order", type: "number" },
  ],
  journey: [
    { key: "role", label: "Role", type: "text" },
    { key: "company", label: "Company / Organization", type: "text" },
    { key: "year", label: "Timeframe / Year", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "location", label: "Location", type: "text" },
    { key: "type", label: "Type", type: "select", options: ["work", "education", "milestone"] },
    { key: "order", label: "Order", type: "number" },
  ],
  testimonials: [
    { key: "name", label: "Name", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "company", label: "Company", type: "text" },
    { key: "content", label: "Testimonial Content", type: "textarea" },
    { key: "avatar_url", label: "Avatar URL", type: "text" },
    { key: "is_featured", label: "Featured", type: "checkbox" },
    { key: "is_approved", label: "Approved", type: "checkbox" },
  ],
};

export default function CollectionAdmin({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = use(params);
  const schema = SCHEMAS[collection];
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>({});
  
  const fetchItems = () => {
    setLoading(true);
    fetch(`/api/resources/${collection}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (schema) fetchItems();
  }, [collection]);

  if (!schema) return <div>Invalid collection. Supported: projects, skills, blogs, achievements, education, journey, testimonials.</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !currentItem._id;
    const url = isNew 
      ? `/api/resources/${collection}` 
      : `/api/resources/${collection}/item?id=${currentItem._id}`;
      
    await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentItem),
    });
    
    setIsEditing(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await fetch(`/api/resources/${collection}/item?id=${id}`, { method: "DELETE" });
      fetchItems();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight capitalize">{collection}</h1>
        <button 
          onClick={() => { setCurrentItem({}); setIsEditing(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
        >
          <Plus className="size-4" /> Add New
        </button>
      </div>

      {isEditing ? (
        <div className="bg-background/50 border border-border/50 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">{currentItem._id ? "Edit" : "Create"} {collection.slice(0, -1)}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {schema.map((field: any) => (
                <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <label className="text-sm font-medium block mb-1">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea 
                      value={currentItem[field.key] || ""}
                      onChange={(e) => setCurrentItem({...currentItem, [field.key]: e.target.value})}
                      className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 min-h-[100px]"
                    />
                  ) : field.type === "checkbox" ? (
                    <input 
                      type="checkbox"
                      checked={!!currentItem[field.key]}
                      onChange={(e) => setCurrentItem({...currentItem, [field.key]: e.target.checked})}
                      className="size-5 ml-2"
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={currentItem[field.key] || ""}
                      onChange={(e) => setCurrentItem({...currentItem, [field.key]: e.target.value})}
                      className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2"
                    >
                      <option value="">Select...</option>
                      {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input 
                      type={field.type}
                      value={currentItem[field.key] || ""}
                      onChange={(e) => setCurrentItem({...currentItem, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value})}
                      className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-secondary text-foreground px-4 py-2 rounded-lg font-medium">Cancel</button>
            </div>
          </form>
        </div>
      ) : loading ? (
        <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-background/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-secondary/30 border-b border-border/50">
              <tr>
                <th className="p-4 font-medium">{schema[0].label}</th>
                <th className="p-4 font-medium hidden md:table-cell">{schema[1].label}</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-secondary/10">
                  <td className="p-4 font-medium">{item[schema[0].key]}</td>
                  <td className="p-4 text-muted-foreground truncate max-w-[200px] hidden md:table-cell">{String(item[schema[1].key]).substring(0, 50)}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => { setCurrentItem(item); setIsEditing(true); }} className="p-2 hover:bg-secondary rounded-md text-blue-400"><Edit2 className="size-4" /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-secondary rounded-md text-red-400"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
