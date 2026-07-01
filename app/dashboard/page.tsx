"use client";

import { useEffect, useState } from "react";
import TabBar from "../components/TabBar";

export default function Dashboard() {
  const [data, setData] = useState<any>({
    schedule: [],
    checklist: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem("trip-data");
    if (saved) setData(JSON.parse(saved));
  }, []);

  const doneChecklist =
    data.checklist?.filter((i: any) => i.done).length || 0;

  const totalChecklist = data.checklist?.length || 0;

  // Day 그룹핑 (요약용)
  const grouped = data.schedule.reduce((acc: any, item: any) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  return (
    <main style={styles.container}>

      {/* TOP */}
      <div style={styles.topBar}>
        <div style={styles.title}>📍 Sapporo Trip</div>
        <div>⚙️</div>
      </div>

      {/* SUMMARY */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>📊 여행 요약</div>

        <p style={styles.text}>📅 전체 일정: {data.schedule.length}개</p>
        <p style={styles.text}>
          🧳 준비물: {doneChecklist}/{totalChecklist}
        </p>

        <p style={styles.text}>
          📍 Day 1: {(grouped[1] || []).length}개
        </p>
        <p style={styles.text}>
          📍 Day 2: {(grouped[2] || []).length}개
        </p>
        <p style={styles.text}>
          📍 Day 3: {(grouped[3] || []).length}개
        </p>
      </div>

      {/* STATUS CARD */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>🧭 상태</div>

        <p style={styles.text}>
          {data.schedule.length === 0
            ? "아직 여행 일정이 없습니다"
            : "여행 계획이 생성되었습니다"}
        </p>
      </div>

      <TabBar />
    </main>
  );
}

/* STYLE */
const styles: any = {
  container: {
    padding: 16,
    paddingBottom: 80,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    background: "#f5f5f7",
    minHeight: "100vh",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 14,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
  },

  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
  },

  text: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
};