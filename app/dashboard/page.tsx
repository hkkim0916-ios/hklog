"use client";

import { useEffect, useRef, useState } from "react";

type ScheduleItem = {
  place: string;
  coords: [number, number];
};

export default function Dashboard() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const LRef = useRef<any>(null);

  const [input, setInput] = useState("");

  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  const placeMap: Record<string, [number, number]> = {
    공항: [42.7752, 141.6923],
    오타루: [43.1907, 140.9944],
    운하: [43.1956, 140.9947],
  };

  // ✔ 로컬 저장 불러오기 (새로고침 유지)
  useEffect(() => {
    const saved = localStorage.getItem("schedule");
    if (saved) setSchedule(JSON.parse(saved));
  }, []);

  // ✔ 변경될 때마다 저장
  useEffect(() => {
    localStorage.setItem("schedule", JSON.stringify(schedule));
  }, [schedule]);

  // ✔ 지도 초기화
  useEffect(() => {
    const init = async () => {
      if (!mapRef.current || mapInstance.current) return;

      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      LRef.current = L;

      const map = L.map(mapRef.current).setView([43.06, 141.35], 11);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);
    };

    init();

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // ✔ 마커 + 경로
  useEffect(() => {
    if (!mapInstance.current || !LRef.current) return;

    const map = mapInstance.current;
    const L = LRef.current;

    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const points = schedule.map((s) => s.coords);

    points.forEach((p) => {
      L.marker(p).addTo(map);
    });

    if (points.length > 1) {
      L.polyline(points, { color: "blue" }).addTo(map);
    }
  }, [schedule]);

  return (
    <div className="app">
      {/* 상단 */}
      <div className="header">✈ 여행 대시보드</div>

      {/* 본문 */}
      <div className="body">
        {/* 좌측 */}
        <div className="panel">
          <h3>여행 일정</h3>

          <input
            value={input}
            placeholder="공항 / 오타루 / 운하"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const coords = placeMap[input];

                if (coords) {
                  setSchedule((prev) => [
                    ...prev,
                    { place: input, coords },
                  ]);
                }

                setInput("");
              }
            }}
            className="input"
          />

          <ul>
            {schedule.map((s, i) => (
              <li key={i}>{s.place}</li>
            ))}
          </ul>
        </div>

        {/* 지도 */}
        <div ref={mapRef} className="map" />
      </div>

      {/* 하단바 */}
      <div className="bottomNav">
        <div>🏠 홈</div>
        <div>🗺 지도</div>
        <div>📍 일정</div>
      </div>

      {/* 스타일 */}
      <style jsx>{`
        .app {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          height: 50px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          font-weight: bold;
          border-bottom: 1px solid #ddd;
        }

        .body {
          flex: 1;
          display: flex;
        }

        .panel {
          width: 280px;
          padding: 12px;
          border-right: 1px solid #ddd;
          overflow-y: auto;
        }

        .input {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
        }

        .map {
          flex: 1;
        }

        .bottomNav {
          height: 55px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid #ddd;
        }

        /* 모바일 대응 */
        @media (max-width: 768px) {
          .body {
            flex-direction: column;
          }

          .panel {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #ddd;
          }

          .map {
            height: 55vh;
          }
        }
      `}</style>
    </div>
  );
}