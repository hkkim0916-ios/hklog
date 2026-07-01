"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    let L: any;

    const init = async () => {
      if (!mapRef.current || mapInstance.current) return;

      L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current).setView([43.06, 141.35], 11);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      L.marker([43.06, 141.35]).addTo(map);
    };

    init();

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div style={{ padding: 10, fontWeight: 600 }}>
        여행 지도
      </div>

      <div
        ref={mapRef}
        style={{
          height: "calc(100vh - 40px)",
          width: "100%",
        }}
      />
    </div>
  );
}