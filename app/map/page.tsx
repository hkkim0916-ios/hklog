"use client";

import { useState, useEffect } from "react";
import MapView from "./MapView";
import ScheduleBoard from "./ScheduleBoard";

type Item = { place: string; time: string };

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);

  const generateAI = () => {
    const data: Item[] = [
      { place: "공항", time: "09:00" },
      { place: "오타루", time: "12:00" },
      { place: "운하", time: "15:00" },
    ];

    setItems(data);
    setSelected(null);
    setIndex(0);

    localStorage.setItem("trip", JSON.stringify(data));
  };

  useEffect(() => {
    const saved = localStorage.getItem("trip");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (index >= items.length) {
      setPlaying(false);
      return;
    }

    const t = setTimeout(() => {
      setSelected(items[index].place);
      setIndex((p) => p + 1);
    }, 1500);

    return () => clearTimeout(t);
  }, [playing, index, items]);

  return (
    <div className="wrap">
      <div className="left">
        <button onClick={generateAI}>AI 생성</button>

        <button
          onClick={() => {
            setIndex(0);
            setPlaying(true);
          }}
        >
          재생
        </button>

        <ScheduleBoard
          items={items}
          setItems={(v: any) => {
            setItems(v);
            localStorage.setItem("trip", JSON.stringify(v));
          }}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      <div className="right">
        <MapView schedule={items} selected={selected} />
      </div>

      <style jsx>{`
        .wrap {
          display: flex;
          height: 100vh;
        }
        .left {
          width: 320px;
          padding: 12px;
          border-right: 1px solid #eee;
          overflow: auto;
        }
        .right {
          flex: 1;
        }
        button {
          width: 100%;
          margin-bottom: 8px;
          padding: 10px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          background: #eee;
        }
        @media (max-width: 768px) {
          .wrap {
            flex-direction: column;
          }
          .left {
            width: 100%;
            height: 40%;
          }
          .right {
            height: 60%;
          }
        }
      `}</style>
    </div>
  );
}