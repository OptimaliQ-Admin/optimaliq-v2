"use client";
import { useEffect, useState } from "react";

export default function PlanHealth({ planId, onFilterBlocked }: { planId: string; onFilterBlocked?: () => void }) {
  const [health, setHealth] = useState<any>(null);
  const [burndown, setBurndown] = useState<{ day: string; open: number }[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/growth-plan/current`);
      const json = await res.json();
      // derive health client-side when view isn't exposed as API
      const levers = json?.levers || [];
      const total = levers.length || 0;
      const done = levers.filter((l: any)=> l.status==='done').length;
      const blocked = levers.filter((l: any)=> l.status==='blocked').length;
      const avgImpact = avg(levers.map((l:any)=> Number(l.impact||0)));
      const avgEffort = avg(levers.map((l:any)=> Number(l.effort||0)));
      setHealth({ total, completion_ratio: total? done/total: 0, blocked_count: blocked, avg_impact: avgImpact, avg_effort: avgEffort });

      // derive simple burndown as open count per day from period_start..end (client-only fallback)
      const start = new Date(json?.plan?.period_start);
      const end = new Date(json?.plan?.period_end);
      if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const days: { day: string; open: number }[] = [];
        for (let d = new Date(start); d <= end; d = new Date(d.getTime()+86400000)) {
          const dayStr = d.toISOString().slice(0,10);
          const open = levers.filter((l:any)=> l.status!=='done' || (l.completed_at && new Date(l.completed_at) > d)).length;
          days.push({ day: dayStr, open });
        }
        setBurndown(days);
      }
    })();
  }, [planId]);

  if (!health) return null;

  return (
    <div className="mt-3 border-t pt-3 text-xs flex items-center gap-4">
      <div>Completion: {(health.completion_ratio*100).toFixed(0)}%</div>
      <button className="underline text-red-600" onClick={onFilterBlocked}>Blocked: {health.blocked_count}</button>
      <div>Impact: {health.avg_impact?.toFixed?.(1) || '—'}</div>
      <div>Effort: {health.avg_effort?.toFixed?.(1) || '—'}</div>
      <div className="ml-auto flex items-center gap-1">
        <span>Burndown</span>
        <MiniSparkline data={burndown} />
      </div>
    </div>
  );
}

function avg(arr: number[]) {
  const vals = arr.filter((n)=> n>0);
  if (!vals.length) return 0;
  return vals.reduce((a,b)=>a+b,0)/vals.length;
}

function MiniSparkline({ data }: { data: { day: string; open: number }[] }) {
  const max = Math.max(1, ...data.map(d=> d.open));
  const pts = data.map((d, i) => {
    const x = (i/(Math.max(1,data.length-1)))*100;
    const y = 100 - (d.open/max)*100;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width="100" height="24" viewBox="0 0 100 24" className="text-blue-600">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={pts} />
    </svg>
  );
}


