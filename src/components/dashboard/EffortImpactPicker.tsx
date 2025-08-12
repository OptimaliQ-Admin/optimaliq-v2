"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function EffortImpactPicker({ leverId, initialEffort = 3, initialImpact = 3 }: { leverId: string; initialEffort?: number; initialImpact?: number; }) {
  const [effort, setEffort] = useState(initialEffort);
  const [impact, setImpact] = useState(initialImpact);
  const ice = Math.round((impact / Math.max(1, effort)) * 10) / 10;

  const save = async () => {
    await fetch(`/api/growth-plan/levers/${leverId}/progress`, { method: "POST", body: JSON.stringify({ effort, impact }) });
  };

  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span>Effort</span>
        <Slider defaultValue={String(effort)} max={5 as any} min={1 as any} step={1 as any} onValueChange={(v) => setEffort(v)} className="w-24" />
        <span>{effort}</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Impact</span>
        <Slider defaultValue={String(impact)} max={5 as any} min={1 as any} step={1 as any} onValueChange={(v) => setImpact(v)} className="w-24" />
        <span>{impact}</span>
      </div>
      <div className="px-2 py-1 rounded bg-blue-50 text-blue-700">ICE {ice}</div>
      <Button size="sm" variant="outline" onClick={save}>Save</Button>
    </div>
  );
}


