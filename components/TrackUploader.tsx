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
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";


export default function TrackUploader() {
  const addTrack = useStore((state) => state.addTrack);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    for (const file of Array.from(e.target.files)) {
      const text = await file.text();
      const gpxJson = xml2js(text, { compact: true });

      // Ensure trkpt exists
      const trk = gpxJson.gpx?.trk;
      if (!trk) continue;

      const trkseg = trk.trkseg;
      if (!trkseg) continue;

      let trkpts: any[] = [];
      if (Array.isArray(trkseg)) {
        // Multiple segments
        trkseg.forEach((seg: any) => {
          if (seg.trkpt)
            trkpts.push(
              ...(Array.isArray(seg.trkpt) ? seg.trkpt : [seg.trkpt]),
            );
        });
      } else {
        // Single segment
        if (trkseg.trkpt)
          trkpts = Array.isArray(trkseg.trkpt) ? trkseg.trkpt : [trkseg.trkpt];
      }

      const points = trkpts.map((pt) => ({
        lat: parseFloat(pt._attributes.lat),
        lon: parseFloat(pt._attributes.lon),
        time: new Date(pt.time._text).getTime(),
      }));

      const cleanPoints = removeOutliers(points, 10); // remove points >10 km
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
  };

  return (
    
    <div className="shadow flex items-center p-4 bg-gray-50">
      <div className="flex-shrink-0 mr-4">
        <CloudArrowUpIcon className="w-8 h-8 text-blue-600" />
      </div>

      <div className="flex-1">
        <label className="block text-gray-800 font-semibold mb-1">
          Upload GPX files
        </label>
        <span className="text-gray-600 text-sm mb-2 block">
          Select one or multiple GPX files
        </span>
        <input
          type="file"
          multiple
          accept=".gpx"
          onChange={handleFiles}
          className="w-full border bg-white p-2 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
