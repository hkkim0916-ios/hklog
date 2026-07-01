"use client";

import { useEffect, useState } from "react";
import TabBar from "../components/TabBar";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

export default function PlanPage() {
  const [data, setData] = useState<any>(null); // 핵심 변경
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("trip-data");

    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData({ schedule: [] });
    }
  }, []);

  if (!mounted || !data) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  const generatePlan = () => {
    const plan = [
      { id: "1", day: 1, time: "09:00", place: "공항" },
      { id: "2", day: 1, time: "12:00", place: "이동" },
      { id: "3", day: 1, time: "18:00", place: "식사" },
      { id: "4", day: 2, time: "10:00", place: "오타루" },
      { id: "5", day: 2, time: "15:00", place: "운하" },
    ];

    const updated = { ...data, schedule: plan };

    setData(updated);
    localStorage.setItem("trip-data", JSON.stringify(updated));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = data.schedule.findIndex((i: any) => i.id === active.id);
    const newIndex = data.schedule.findIndex((i: any) => i.id === over.id);

    const newSchedule = arrayMove(data.schedule, oldIndex, newIndex);

    const updated = { ...data, schedule: newSchedule };

    setData(updated);
    localStorage.setItem("trip-data", JSON.stringify(updated));
  };

  return (
    <main style={styles.container}>

      <div style={styles.card}>
        <h2>🤖 일정 생성</h2>
        <button onClick={generatePlan} style={styles.button}>
          생성
        </button>
      </div>

      <div style={styles.card}>
        <h3>📅 드래그 일정</h3>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={(data.schedule || []).map((i: any) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {(data.schedule || []).map((item: any) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <TabBar />
    </main>
  );
}

/* ITEM */
function SortableItem({ item }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        padding: 12,
        marginBottom: 8,
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #ddd",
        cursor: "grab",
      }}
    >
      📍 {item.time} - {item.place}
    </div>
  );
}

const styles: any = {
  container: {
    padding: 16,
    paddingBottom: 80,
    fontFamily: "sans-serif",
    background: "#f5f5f7",
    minHeight: "100vh",
  },

  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  button: {
    padding: 12,
    background: "#007aff",
    color: "#fff",
    border: "none",
    borderRadius: 10,
  },
};