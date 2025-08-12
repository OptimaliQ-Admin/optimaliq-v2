"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function LeverSubtasks({ leverId }: { leverId: string }) {
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const res = await fetch("/api/growth-plan/current");
    const json = await res.json();
    const found = (json?.levers || []).find((l: any) => l.id === leverId);
    setSubtasks(found?.subtasks || []);
  };

  useEffect(() => { load(); }, [leverId]);

  const add = async () => {
    if (!title.trim()) return;
    await fetch(`/api/growth-plan/levers/${leverId}/subtasks`, {
      method: "POST",
      body: JSON.stringify({ title })
    });
    setTitle("");
    load();
  };

  const toggle = async (sid: string, status: string) => {
    const next = status === 'done' ? 'todo' : 'done';
    await fetch(`/api/growth-plan/levers/${leverId}/subtasks/${sid}/progress`, { method: "POST", body: JSON.stringify({ status: next }) });
    load();
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Add a subtask" value={title} onChange={e => setTitle(e.target.value)} />
        <Button size="sm" onClick={add}>Add</Button>
      </div>
      <ul className="space-y-1">
        {subtasks.map(st => (
          <li key={st.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={st.status === 'done'} onChange={() => toggle(st.id, st.status)} />
            <span className={st.status === 'done' ? 'line-through text-gray-500' : ''}>{st.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


