"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

type Props = {
  id: string;
  question: string;
  description?: string;
  items: string[];
  onChange: (newOrder: string[]) => void;
};

export default function DragSortQuestion({
  question,
  description,
  items,
  onChange,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);
      onChange(reordered);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">{question}</h2>
      {description && <p className="text-gray-600 mt-1 mb-3">{description}</p>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {items.map((item) => (
              <SortableItem key={item} id={item} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
