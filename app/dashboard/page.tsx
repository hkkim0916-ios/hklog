"use client";

import { useEffect, useRef, useState } from "react";

type Item = {
  place: string;
  coords: [number, number];
};

export default function Dashboard() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const LRef = useRef<any>(null);

  const [input, setInput] = useState("");

  const [schedule, setSchedule] = useState<Item[]>([
    { place: "공항", coords: [42.7752, 141.6923] },
    { place: "오타루", coords: [43.1907, 140.9944] },
  ]);

  const placeMap: Record<string, [number, number]> = {
    공항: [42.7752, 141.6923],
    오타루: [43.1907, 140.9944],
    운하: [43.1956, 140.9947],
  };

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

    points.forEach((p) => L.marker(p).addTo(map));

    if (points.length > 1) {
      L.polyline(points, { color: "blue" }).addTo(map);
    }
  }, [schedule]);

  return (
    <div className="app">
      {/* HEADER */}
      <div className="header">✈ 여행 대시보드</div>

      {/* BODY */}
      <div className="body">
        {/* LEFT */}
        <div className="panel">
          <div className="title">일정</div>

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
          />

          <div className="list">
            {schedule.map((s, i) => (
              <div key={i} className="item">
                {s.place}
              </div>
            ))}
          </div>
        </div>

        {/* MAP */}
        <div ref={mapRef} className="map" />
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom">
        <div>홈</div>
        <div>지도</div>
        <div>일정</div>
      </div>

      <style jsx>{`
        .app {
          height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: sans-serif;
        }

        .header {
          height: 52px;
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

        .title {
          font-weight: bold;
          margin-bottom: 10px;
        }

        input {
          width: 100%;
          padding: 8px;
          margin-bottom: 12px;
        }

        .item {
          padding: 6px 0;
          border-bottom: 1px solid #eee;
        }

        .map {
          flex: 1;
        }

        .bottom {
          height: 54px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid #ddd;
        }

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