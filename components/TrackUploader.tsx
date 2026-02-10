"use client";

import { getRandomColor } from "@/utils/color";
import { useStore } from "@/lib/store";
import { xml2js } from "xml-js";
import {
  averageSpeed,
  duration,
  removeOutliers,
  totalDistance,
} from "@/utils/gpx";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

export default function TrackUploader() {
  const addTrack = useStore((state) => state.addTrack);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    for (const file of Array.from(e.target.files)) {
      const text = await file.text();
      const gpxJson = xml2js(text, { compact: true });

      const trk = gpxJson.gpx?.trk;
      if (!trk) continue;

      const trkseg = trk.trkseg;
      if (!trkseg) continue;

      let trkpts: any[] = [];
      if (Array.isArray(trkseg)) {
        trkseg.forEach((seg: any) => {
          if (seg.trkpt)
            trkpts.push(
              ...(Array.isArray(seg.trkpt) ? seg.trkpt : [seg.trkpt]),
            );
        });
      } else {
        if (trkseg.trkpt)
          trkpts = Array.isArray(trkseg.trkpt) ? trkseg.trkpt : [trkseg.trkpt];
      }

      const points = trkpts.map((pt) => ({
        lat: parseFloat(pt._attributes.lat),
        lon: parseFloat(pt._attributes.lon),
        time: new Date(pt.time._text).getTime(),
      }));

      const cleanPoints = removeOutliers(points, 10);
      const stats = {
        distanceKm: totalDistance(cleanPoints),
        durationH: duration(cleanPoints),
        avgSpeed: averageSpeed(cleanPoints),
      };

      addTrack({
        name: file.name,
        points: cleanPoints,
        color: getRandomColor(),
        stats,
      });
    }
    e.target.value = "";
  };

  return (
    <div className="relative rounded-[var(--radius-card)] border-2 border-dashed border-slate-200 bg-white/80 p-8 transition-all duration-200 hover:border-teal-300 hover:bg-teal-50/50 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
      <input
        type="file"
        multiple
        accept=".gpx"
        onChange={handleFiles}
        id="gpx-upload"
        aria-label="Upload GPX files"
      />
      <label
        htmlFor="gpx-upload"
        className="flex flex-col items-center justify-center gap-3 cursor-pointer text-center min-h-[120px]"
      >
        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 text-teal-600">
          <CloudArrowUpIcon className="w-7 h-7" strokeWidth={1.8} />
        </span>
        <span className="font-semibold text-slate-800">
          Upload GPX files
        </span>
        <span className="text-sm text-slate-500 max-w-sm">
          Drag files here or click to select one or multiple .gpx files
        </span>
      </label>
    </div>
  );
}
