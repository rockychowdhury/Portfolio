"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

export default function StatsAdmin() {
  const [handles, setHandles] = useState({
    github: "",
    leetcode: "",
    codeforces: "",
    codechef: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/stats-config")
      .then((res) => res.json())
      .then((data) => {
        setHandles(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandles({ ...handles, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      await fetch("/api/stats-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(handles),
      });
      alert("Platform usernames updated successfully!");
    } catch (error) {
      alert("Failed to save changes.");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Stats</h1>
          <p className="text-muted-foreground mt-2">
            Update your platform usernames here. The background synchronization jobs will automatically fetch new statistics for these handles.
          </p>
        </div>
        <button 
          onClick={saveChanges} 
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save Usernames
        </button>
      </div>

      <div className="grid gap-6">
        <div className="bg-background/50 border border-border/50 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold border-b border-border/50 pb-2">Open Source</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub Username</label>
            <input 
              name="github"
              value={handles.github}
              onChange={handleChange}
              placeholder="e.g., torvalds"
              className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="bg-background/50 border border-border/50 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold border-b border-border/50 pb-2">Competitive Programming</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">LeetCode Username</label>
            <input 
              name="leetcode"
              value={handles.leetcode}
              onChange={handleChange}
              placeholder="e.g., rocky20809"
              className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Codeforces Handle</label>
            <input 
              name="codeforces"
              value={handles.codeforces}
              onChange={handleChange}
              placeholder="e.g., rocky20809"
              className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">CodeChef Handle</label>
            <input 
              name="codechef"
              value={handles.codechef}
              onChange={handleChange}
              placeholder="e.g., rocky20809"
              className="w-full bg-secondary/30 border border-border/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
