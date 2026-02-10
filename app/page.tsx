"use client";

import TrackUploader from "@/components/TrackUploader";
import MapView from "@/components/MapView";
import { TrackStatsPanel } from "@/components/TrackStatsPanel";
import { TrackSimilarityPanel } from "@/components/TrackSimilarityPanel";
import { useStore } from "@/lib/store";
import { useState } from "react";

import { ArrowPathIcon, MapPinIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const tracks = useStore((state) => state.tracks);
  const setMergedTrack = useStore((state) => state.setMergedTrack);
  const [merging, setMerging] = useState(false);

  const handleMerge = async () => {
    setMerging(true);
    try {
      const res = await fetch("/api/merge-tracks", {
        method: "POST",
        body: JSON.stringify({ tracks: tracks.map((t) => t.points) }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setMergedTrack(data.merged);
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            PathFuse
          </h1>
          <p className="mt-1 text-slate-600 text-sm sm:text-base">
            Merge, clean, and visualize your GPX tracks
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 space-y-8 w-full">
            <section>
              <TrackUploader />
            </section>

            {tracks.length > 1 && (
              <section>
                <button
                  onClick={handleMerge}
                  disabled={merging}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-teal-600 px-6 py-3 font-semibold text-white shadow-[var(--shadow-button)] transition-colors hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {merging ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Merging…
                    </>
                  ) : (
                    <>
                      <ArrowPathIcon className="w-5 h-5" />
                      Merge tracks
                    </>
                  )}
                </button>
              </section>
            )}

            <section>
              <div className="rounded-[var(--radius-card)] overflow-hidden bg-white shadow-[var(--shadow-card)] border border-slate-200/80">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Map
                  </h2>
                </div>
                <div className="min-h-[420px]">
                  {tracks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[320px] text-slate-400">
                      <MapPinIcon className="w-12 h-12 mb-3 opacity-60" />
                      <p className="text-sm font-medium">No tracks yet</p>
                      <p className="text-xs mt-0.5">
                        Upload GPX files to see them here
                      </p>
                    </div>
                  ) : (
                    <MapView />
                  )}
                </div>
              </div>
            </section>
          </div>

          <aside className="w-full lg:w-80 space-y-4 lg:sticky lg:top-24">
            <TrackStatsPanel />
            <TrackSimilarityPanel />
          </aside>
        </div>
      </main>

      <footer className="mt-16 py-6 border-t border-slate-200/80 text-center text-sm text-slate-500">
        PathFuse - merge and clean your GPX tracks
      </footer>
    </div>
  );
}
