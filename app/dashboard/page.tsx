"use client";

import { useEffect, useRef, useState } from "react";

export default function Dashboard() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  const [schedule] = useState([
    { place: "공항", coords: [42.7752, 141.6923] },
    { place: "오타루", coords: [43.1907, 140.9944] },
    { place: "운하", coords: [43.1956, 140.9947] },
  ]);

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

      // 마커 + 경로
      const points = schedule.map((s) => s.coords);

      points.forEach((p) => {
        L.marker(p).addTo(map);
      });

      L.polyline(points, { color: "blue" }).addTo(map);
    };

    initMap();

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [schedule]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 왼쪽 일정 */}
      <div
        style={{
          width: "280px",
          padding: 16,
          borderRight: "1px solid #ddd",
        }}
      >
        <h2>여행 일정</h2>

        <ul style={{ paddingLeft: 16 }}>
          {schedule.map((item, i) => (
            <li key={i}>{item.place}</li>
          ))}
        </ul>
      </div>

      {/* 지도 */}
      <div style={{ flex: 1 }} ref={mapRef} />
    </div>
  );
}