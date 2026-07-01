"use client";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function Item({ item, selected, onClick }: any) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: item.place });

  const active = selected === item.place;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onClick(item.place)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        padding: 12,
        marginBottom: 8,
        borderRadius: 10,
        background: active ? "#2563eb" : "#f3f3f3",
        color: active ? "#fff" : "#000",
        cursor: "pointer",
      }}
    >
      <div>{item.place}</div>
      <div style={{ fontSize: 12 }}>{item.time}</div>
    </div>
  );
}

export default function ScheduleBoard({
  items,
  setItems,
  selected,
  setSelected,
}: any) {
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over) return;

        if (active.id !== over.id) {
          const oldIndex = items.findIndex(
            (i: any) => i.place === active.id
          );
          const newIndex = items.findIndex(
            (i: any) => i.place === over.id
          );

          setItems(arrayMove(items, oldIndex, newIndex));
        }
      }}
    >
      <SortableContext
        items={items.map((i: any) => i.place)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item: any) => (
          <Item
            key={item.place}
            item={item}
            selected={selected}
            onClick={setSelected}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}