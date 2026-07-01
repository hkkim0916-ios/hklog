"use client";

import { useEffect, useRef } from "react";

export default function MapView({ schedule, selected }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>({});

  useEffect(() => {
    let L: any;

    (async () => {
      if (!ref.current) return;

      L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (mapRef.current) mapRef.current.remove();

      const map = L.map(ref.current).setView([43.06, 141.35], 11);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const loc: Record<string, [number, number]> = {
        공항: [42.7752, 141.6923],
        오타루: [43.1907, 140.9944],
        운하: [43.1956, 140.9947],
      };

      schedule.forEach((s: any) => {
        const pos = loc[s.place];
        if (!pos) return;

        markerRef.current[s.place] = L.marker(pos).addTo(map);
      });
    })();

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [schedule]);

  useEffect(() => {
    if (!mapRef.current || !selected) return;

    const loc: Record<string, [number, number]> = {
      공항: [42.7752, 141.6923],
      오타루: [43.1907, 140.9944],
      운하: [43.1956, 140.9947],
    };

    const pos = loc[selected];
    if (!pos) return;

    mapRef.current.setView(pos, 14, { animate: true });

    markerRef.current[selected]?.openPopup?.();
  }, [selected]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}