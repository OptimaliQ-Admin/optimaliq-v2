"use client";
import { useEffect, useState } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent, DragStartEvent, Over } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";

type Lever = {
  id: string;
  title: string;
  description?: string;
  status: "todo"|"in_progress"|"done"|"blocked";
  priority: number;
  success_metric?: string;
  target_value?: string;
  due_date?: string;
};

export default function TasksKanban() {
  const [levers, setLevers] = useState<Lever[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [showBlockerPrompt, setShowBlockerPrompt] = useState<{ leverId: string; toStatus: Lever["status"]; } | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/growth-plan/current");
      const json = await res.json();
      setLevers(json?.levers || []);
    })();
  }, []);

  const onDragStart = (event: DragStartEvent) => {
    setDraggingId(String(event.active.id));
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;
    const leverId = String(active.id);
    const newStatus = over.id as Lever["status"]; // column id
    const lever = levers.find(l => l.id === leverId);
    if (!lever || lever.status === newStatus) return;
    if (newStatus === 'blocked') {
      // Prompt for blocker reason after drop
      setShowBlockerPrompt({ leverId, toStatus: newStatus });
    } else {
      await fetch(`/api/growth-plan/levers/${leverId}/progress`, { method: "POST", body: JSON.stringify({ status: newStatus }) });
      setLevers(prev => prev.map(l => l.id === leverId ? { ...l, status: newStatus } : l));
    }
    setDraggingId(null);
  };

  const columns: { id: Lever["status"]; title: string }[] = [
    { id: "todo", title: "To do" },
    { id: "in_progress", title: "In progress" },
    { id: "done", title: "Done" },
    { id: "blocked", title: "Blocked" }
  ];

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-4">
        {columns.map(col => (
          <div key={col.id} id={col.id} className="border rounded-xl p-3 bg-gray-50 min-h-[160px]">
            <div className="text-sm font-semibold mb-2">{col.title}</div>
            <SortableContext items={(levers.filter(l => l.status === col.id)).map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 min-h-[60px]">
                {levers.filter(l => l.status === col.id).map(l => (
                  <KanbanCard key={l.id} lever={l} onBlock={(id)=> setShowBlockerPrompt({ leverId: id, toStatus: 'blocked' })} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>

      {showBlockerPrompt && (
        <BlockerModal
          onCancel={() => setShowBlockerPrompt(null)}
          onSave={async (reason) => {
            const { leverId, toStatus } = showBlockerPrompt;
            await fetch(`/api/growth-plan/levers/${leverId}/progress`, {
              method: 'POST',
              body: JSON.stringify({ status: toStatus, risk_status: 'blocked', risk_reason: reason })
            });
            setLevers(prev => prev.map(l => l.id === leverId ? { ...l, status: toStatus } : l));
            setShowBlockerPrompt(null);
          }}
        />
      )}
    </DndContext>
  );
}

function KanbanCard({ lever, onBlock }: { lever: Lever; onBlock: (id: string) => void }) {
  return (
    <div id={lever.id} className="bg-white border rounded-lg p-3">
      <div className="text-sm font-medium">{lever.priority}. {lever.title}</div>
      {lever.success_metric && (
        <div className="text-xs text-gray-600">Metric: {lever.success_metric} • Target: {lever.target_value}</div>
      )}
      {lever.due_date && (
        <div className="flex items-center gap-3 mt-1">
          <a className="text-xs text-blue-600" href={`/api/growth-plan/levers/${lever.id}/ics`}>Add to calendar</a>
          <button className="text-xs text-red-600 underline" onClick={()=> onBlock(lever.id)}>Mark blocked</button>
        </div>
      )}
    </div>
  );
}

function BlockerModal({ onCancel, onSave }: { onCancel: () => void; onSave: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-md border shadow-lg">
        <div className="text-sm font-semibold mb-2">Add blocker reason</div>
        <textarea className="w-full border rounded p-2 text-sm" rows={4} placeholder="e.g., Waiting on vendor access / resource constraints" value={reason} onChange={(e)=>setReason(e.target.value)} />
        <div className="mt-3 flex justify-end gap-2">
          <button className="px-3 py-1 text-sm border rounded" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded" onClick={()=> onSave(reason.trim())} disabled={!reason.trim()}>Save</button>
        </div>
      </div>
    </div>
  );
}


