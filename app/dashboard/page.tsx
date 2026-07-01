"use client";

import { useEffect, useRef } from "react";

export default function Dashboard() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

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

      // 기본 마커 1개 (테스트용)
      L.marker([43.06, 141.35]).addTo(map);
    };

    initMap();

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {/* 상단 */}
      <div
        style={{
          padding: 12,
          fontWeight: 600,
          background: "#111",
          color: "#fff",
        }}
      >
        여행 대시보드
      </div>

      {/* 지도 */}
      <div
        ref={mapRef}
        style={{
          height: "calc(100vh - 48px)",
          width: "100%",
        }}
      />
    </div>
  );
}