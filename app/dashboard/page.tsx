"use client";

import { useEffect, useRef, useState } from "react";

export default function Dashboard() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  const [input, setInput] = useState("");

  const [schedule, setSchedule] = useState([
    { place: "공항", coords: [42.7752, 141.6923] },
    { place: "오타루", coords: [43.1907, 140.9944] },
  ]);

  const placeMap: Record<string, [number, number]> = {
    공항: [42.7752, 141.6923],
    오타루: [43.1907, 140.9944],
    운하: [43.1956, 140.9947],
  };

  useEffect(() => {
    let L: any;

    const initMap = async () => {
      if (!mapRef.current || mapInstance.current) return;

      L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current).setView([43.06, 141.35], 11);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);
    };

    initMap();

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;

    // 기존 마커 초기화 (간단 처리: reload 방식)
    map.eachLayer((layer: any) => {
      if (layer._latlng) {
        map.removeLayer(layer);
      }
    });

    const L = (window as any).L;

    const points = schedule.map((s) => s.coords);

    points.forEach((p) => {
      L?.marker(p).addTo(map);
    });

    if (points.length > 1) {
      L?.polyline(points, { color: "blue" }).addTo(map);
    }
  }, [schedule]);

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "row" }}>
      {/* 왼쪽 패널 */}
      <div
        style={{
          width: "280px",
          padding: 16,
          borderRight: "1px solid #ddd",
        }}
      >
        <h2>여행 일정</h2>

        <input
          value={input}
          placeholder="장소 입력 (공항 / 오타루 / 운하)"
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
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 12,
          }}
        />

        <ul>
          {schedule.map((s, i) => (
            <li key={i}>{s.place}</li>
          ))}
        </ul>
      </div>

      {/* 지도 */}
      <div ref={mapRef} style={{ flex: 1 }} />
    </div>
  );
}