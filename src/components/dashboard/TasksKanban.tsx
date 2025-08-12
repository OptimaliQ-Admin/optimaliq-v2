"use client";
import { useEffect, useState } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent } from "@dnd-kit/core";
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
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/growth-plan/current");
      const json = await res.json();
      setLevers(json?.levers || []);
    })();
  }, []);

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;
    const leverId = String(active.id);
    const newStatus = over.id as Lever["status"]; // column id
    const lever = levers.find(l => l.id === leverId);
    if (!lever || lever.status === newStatus) return;
    await fetch(`/api/growth-plan/levers/${leverId}/progress`, { method: "POST", body: JSON.stringify({ status: newStatus }) });
    setLevers(prev => prev.map(l => l.id === leverId ? { ...l, status: newStatus } : l));
  };

  const columns: { id: Lever["status"]; title: string }[] = [
    { id: "todo", title: "To do" },
    { id: "in_progress", title: "In progress" },
    { id: "done", title: "Done" },
    { id: "blocked", title: "Blocked" }
  ];

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-4">
        {columns.map(col => (
          <div key={col.id} className="border rounded-xl p-3 bg-gray-50">
            <div className="text-sm font-semibold mb-2">{col.title}</div>
            <SortableContext items={(levers.filter(l => l.status === col.id)).map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 min-h-[60px]">
                {levers.filter(l => l.status === col.id).map(l => (
                  <KanbanCard key={l.id} lever={l} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}

function KanbanCard({ lever }: { lever: Lever }) {
  return (
    <div id={lever.id} className="bg-white border rounded-lg p-3">
      <div className="text-sm font-medium">{lever.priority}. {lever.title}</div>
      {lever.success_metric && (
        <div className="text-xs text-gray-600">Metric: {lever.success_metric} • Target: {lever.target_value}</div>
      )}
      {lever.due_date && (
        <a className="text-xs text-blue-600" href={`/api/growth-plan/levers/${lever.id}/ics`}>Add to calendar</a>
      )}
    </div>
  );
}


