"use client";

import TrackUploader from "@/components/TrackUploader";
import MapView from "@/components/MapView";
import { TrackStatsPanel } from "@/components/TrackStatsPanel";
import { TrackSimilarityPanel } from "@/components/TrackSimilarityPanel";
import { MergedTrackPanel } from "@/components/MergedTrackPanel";
import { useStore } from "@/lib/store";

import { MapPinIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const tracks = useStore((state) => state.tracks);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4  flex items-center gap-3">
          <div className="">
            <div className="logo" aria-hidden="true"></div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-700">
              PathFuse
            </h1>
            <p className="mt-0 text-slate-500 text-xs sm:text-base">
              Merge, clean, and visualize your GPX tracks
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 space-y-8 w-full">
            <section>
              <TrackUploader />
            </section>

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
            <TrackSimilarityPanel />
          </div>

          <aside className="w-full lg:w-80 space-y-4 lg:sticky lg:top-24">
            <MergedTrackPanel />
            <TrackStatsPanel />
          </aside>
        </div>
      </main>

      <footer className="bg-white mt-6 py-4 border-t border-slate-200/80 text-center text-sm text-slate-500 bottom-0 w-full absolute">
        PathFuse - merge and clean your GPX tracks
      </footer>
    </div>
  );
}
