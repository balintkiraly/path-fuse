"use client";

import { useStore } from "@/lib/store";
import { useMergeTracks } from "@/hooks/useMergeTracks";
import {
  averageSpeed,
  duration,
  elevationStats,
  totalDistance,
  trackToGpx,
} from "@/utils/gpx";
import {
  ArrowPathIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { saveAs } from "file-saver";
import { useState } from "react";

export function MergedTrackPanel() {
  const tracks = useStore((state) => state.tracks);
  const mergedTrack = useStore((state) => state.mergedTrack);
  const mergeMutation = useMergeTracks();
  const [useAi, setUseAi] = useState(false);

  const canMerge = tracks.length > 1;
  const hasMerged = mergedTrack.length > 0;

  const handleMerge = () => {
    if (!canMerge) return;
    mergeMutation.mutate({
      tracks: tracks.map((t) => t.points),
      useAi,
    });
  };

  if (!canMerge) {
    return (
      <aside className="rounded-[var(--radius-card)] border border-slate-200/80 bg-white/70 px-4 py-4 text-sm text-slate-500">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
          Merged track
        </h2>
        <p>
          Merge two or more tracks to see combined statistics and download the
          result as GPX.
        </p>
      </aside>
    );
  }

  const distanceKm = hasMerged ? totalDistance(mergedTrack) : 0;
  const durationH = hasMerged ? duration(mergedTrack) : 0;
  const avgSpeed = hasMerged ? averageSpeed(mergedTrack) : 0;
  const elevation = hasMerged ? elevationStats(mergedTrack) : null;

  const handleDownload = () => {
    const gpx = trackToGpx(mergedTrack, "PathFuse merged track");
    const blob = new Blob([gpx], { type: "application/gpx+xml;charset=utf-8" });
    const name = `pathfuse-merged-${new Date().toISOString().slice(0, 10)}.gpx`;
    saveAs(blob, name);
  };

  const isPending = mergeMutation.isPending;

  return (
    <aside className="rounded-[var(--radius-card)] border border-slate-200/80 bg-white/80 shadow-[var(--shadow-card)] px-4 py-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">
        Merged track
      </h2>

      <div className="flex items-center justify-between mb-2">
        <label className="flex items-start justify-center pt-4 pb-2 px-2 gap-1 text-xs text-slate-700 cursor-pointer select-none">
          <div className="relative inline-block w-11 h-5">
            <input
              checked={useAi}
              onChange={(e) => setUseAi(e.target.checked)}
              id="switch"
              type="checkbox"
              className="peer appearance-none w-8 h-4 bg-slate-100 border border-slate-200 rounded-full checked:bg-teal-700 cursor-pointer transition-colors duration-300"
            />
            <label
              for="switch"
              className="absolute top-[1.5px] left-[1px] w-3 h-3 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-[1rem] cursor-pointer"
            ></label>
          </div>
          <span>Clean tracks with AI before merge</span>
        </label>
      </div>

      <button
        type="button"
        onClick={handleMerge}
        disabled={isPending}
        className="inline-flex items-center gap-2 w-full justify-center rounded-[var(--radius-button)] bg-teal-600 px-3 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-button)] transition-colors hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed mb-3"
      >
        {isPending ? (
          <>
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
            Merging…
          </>
        ) : (
          <>
            <ArrowPathIcon className="w-4 h-4" />
            Merge tracks
          </>
        )}
      </button>

      {hasMerged && (
        <>
          <div className="flex rounded-lg border border-slate-100 bg-white/90 overflow-hidden mb-3">
            <div className="w-1.5 flex-shrink-0 bg-teal-500" />
            <div className="flex-1 p-3">
              <div className="font-medium text-slate-900 mb-2 text-sm">
                Combined route
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">
                  <MapPinIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{distanceKm.toFixed(2)} km</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ClockIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{durationH.toFixed(2)} h</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <BoltIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{avgSpeed.toFixed(2)} km/h avg</span>
                </li>
                {elevation && (
                  <>
                    <li className="flex items-center gap-1.5">
                      <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>+{Math.round(elevation.ascentM)} m</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <ArrowTrendingDownIcon className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span>−{Math.round(elevation.descentM)} m</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-3.5 text-center">↓</span>
                      <span>
                        {Math.round(elevation.minM)}–
                        {Math.round(elevation.maxM)} m
                      </span>
                    </li>
                  </>
                )}
                <li className="flex items-center gap-1.5">
                  <ArrowPathIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{mergedTrack.length} points</span>
                </li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 w-full justify-center rounded-[var(--radius-button)] border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Download GPX
          </button>
        </>
      )}
    </aside>
  );
}
