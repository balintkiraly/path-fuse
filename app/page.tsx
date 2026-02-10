"use client";
import TrackUploader from "@/components/TrackUploader";
import MapView from "@/components/MapView";
import { useStore } from "@/lib/store";
import { trackSimilarity } from "@/utils/gpx";

import {
  ArrowPathIcon,
  ClockIcon,
  MapPinIcon,
  BoltIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  const tracks = useStore((state) => state.tracks);
  const setMergedTrack = useStore((state) => state.setMergedTrack);

  const handleMerge = async () => {
    const res = await fetch("/api/merge-tracks", {
      method: "POST",
      body: JSON.stringify({ tracks: tracks.map((t) => t.points) }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMergedTrack(data.merged);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
        PathFuse - Merge Your GPX Tracks
      </h1>

      <div className="mb-6">
        <TrackUploader />
      </div>

      {tracks.length > 1 && (
        <div className="flex justify-center mb-6">
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors duration-200"
            onClick={handleMerge}
          >
            Merge Tracks
          </button>
        </div>
      )}

      <div className="mb-8 shadow">
        <MapView />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Track Statistics
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {tracks.map((t: any) => (
            <div key={t.name} className="flex shadow">
              {/* Color Accent */}
              <div className="w-1" style={{ backgroundColor: t.color }} />
              <div className="flex-1 p-4">
                <div className="font-bold text-gray-800 mb-2">{t.name}</div>
                <div className="flex items-center gap-3 text-gray-700 text-sm mb-1">
                  <MapPinIcon className="w-5 h-5 text-blue-600" />
                  Distance: {t.stats?.distanceKm.toFixed(2)} km
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm mb-1">
                  <ClockIcon className="w-5 h-5 text-yellow-600" />
                  Duration: {t.stats?.durationH.toFixed(2)} h
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm mb-1">
                  <BoltIcon className="w-5 h-5 text-green-600" />
                  Avg Speed: {t.stats?.avgSpeed.toFixed(2)} km/h
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <ArrowPathIcon className="w-5 h-5 text-purple-600" />
                  Points: {t.points.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {tracks.length > 1 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Track Matching Score
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {tracks.map((t1, i) =>
              tracks.map((t2, j) => {
                if (i >= j) return null;
                const score = trackSimilarity(t1.points, t2.points);
                return (
                  <div key={`${i}-${j}`} className="flex shadow">
                    <div className="w-1 bg-green-500" />
                    <div className="flex-1 p-3 flex items-center gap-3">
                      <UsersIcon className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-800">
                        {t1.name} ↔ {t2.name}:
                      </span>
                      <span className="text-blue-600">{score}%</span>
                    </div>
                  </div>
                );
              }),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
