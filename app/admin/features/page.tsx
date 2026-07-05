"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, ArrowUp, ArrowDown } from "lucide-react";

interface Feature {
  _id: string;
  name: string;
  componentId: string;
  order: number;
  isActive: boolean;
}

export default function FeaturesAdmin() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchFeatures = () => {
    setLoading(true);
    fetch("/api/features")
      .then((res) => res.json())
      .then((data) => {
        setFeatures(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const saveFeaturesToDb = async (updatedFeatures: Feature[]) => {
    setSaving(true);
    try {
      await fetch("/api/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFeatures),
      });
    } catch (error) {
      console.error("Failed to save layout.", error);
    }
    setSaving(false);
  };

  const moveFeature = (index: number, direction: "up" | "down") => {
    const newFeatures = [...features];
    if (direction === "up" && index > 0) {
      const temp = newFeatures[index];
      newFeatures[index] = newFeatures[index - 1];
      newFeatures[index - 1] = temp;
    } else if (direction === "down" && index < newFeatures.length - 1) {
      const temp = newFeatures[index];
      newFeatures[index] = newFeatures[index + 1];
      newFeatures[index + 1] = temp;
    }
    
    const reordered = newFeatures.map((f, i) => ({ ...f, order: i + 1 }));
    setFeatures(reordered);
    saveFeaturesToDb(reordered); // Auto-save
  };

  const toggleFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], isActive: !newFeatures[index].isActive };
    setFeatures(newFeatures);
    saveFeaturesToDb(newFeatures); // Auto-save
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center bg-secondary/10 p-4 rounded-xl border border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Feature Toggles 
            {saving && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Control which sections appear on the homepage and reorder them. Changes are saved automatically.
          </p>
        </div>
      </div>

      <div className="bg-background/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <ul className="divide-y divide-border/50">
          {features.map((feature, index) => (
            <li 
              key={feature._id} 
              className={`flex items-center justify-between p-4 transition-all duration-300 ${!feature.isActive ? 'bg-secondary/10 opacity-75' : 'bg-transparent'}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1 bg-secondary/20 rounded-md p-1 border border-border/30">
                  <button 
                    disabled={index === 0}
                    onClick={() => moveFeature(index, "up")}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button 
                    disabled={index === features.length - 1}
                    onClick={() => moveFeature(index, "down")}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </div>
                <div>
                  <h3 className={`font-semibold text-lg flex items-center gap-2 ${!feature.isActive ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {feature.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mt-1 bg-secondary/30 px-2 py-0.5 rounded-md inline-block border border-border/50">
                    ID: {feature.componentId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pr-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${feature.isActive ? 'text-green-500' : 'text-muted-foreground'}`}>
                  {feature.isActive ? 'Visible' : 'Hidden'}
                </span>
                
                {/* Switch Toggle */}
                <button
                  onClick={() => toggleFeature(index)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${feature.isActive ? 'bg-primary' : 'bg-secondary border border-border/50'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform duration-200 shadow-sm ${feature.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </li>
          ))}
          {features.length === 0 && <div className="p-8 text-center text-muted-foreground">No features configured.</div>}
        </ul>
      </div>
    </div>
  );
}
