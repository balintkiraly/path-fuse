"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const tracks = useStore((state) => state.tracks);
  const mergedTrack = useStore((state) => state.mergedTrack);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [0, 0],
      zoom: 2,
    });

    map.on("load", () => {
      const allCoords = [
        ...tracks.flatMap((t) => t.points.map((p) => [p.lon, p.lat])),
        ...mergedTrack.map((p) => [p.lon, p.lat]),
      ];

      if (allCoords.length > 0) {
        const lons = allCoords.map((c) => c[0]);
        const lats = allCoords.map((c) => c[1]);
        const bounds = [
          [Math.min(...lons), Math.min(...lats)],
          [Math.max(...lons), Math.max(...lats)],
        ] as [[number, number], [number, number]];

        map.fitBounds(bounds, { padding: 50 });
      }
      // Add each track
      tracks.forEach((track, idx) => {
        const coords = track.points.map((p) => [p.lon, p.lat]);
        map.addSource(`track-${idx}`, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: coords },
          },
        });
        map.addLayer({
          id: `track-${idx}`,
          type: "line",
          source: `track-${idx}`,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": track.color, "line-width": 4 },
        });
      });

      // Add merged track
      if (mergedTrack.length > 0) {
        const coords = mergedTrack.map((p) => [p.lon, p.lat]);
        if (!map.getSource("merged")) {
          map.addSource("merged", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: { type: "LineString", coordinates: coords },
            },
          });
          map.addLayer({
            id: "merged",
            type: "line",
            source: "merged",
            paint: { "line-color": "#FF0000", "line-width": 5 },
          });
        } else {
          (map.getSource("merged") as any).setData({
            type: "Feature",
            geometry: { type: "LineString", coordinates: coords },
          });
        }
      }
    });

    return () => map.remove();
  }, [tracks, mergedTrack]);

  return <div ref={mapContainer} className="w-full h-[500px]" />;
}
