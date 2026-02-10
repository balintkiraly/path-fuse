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
        <div className="max-w-5xl flex mx-auto items-center justify-between gap-2">
          <span>PathFuse - merge and clean your GPX tracks</span>
          <a
            href="https://github.com/balintkiraly/path-fuse"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-6 w-6 fill-zinc-500 transition hover:fill-zinc-600"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.475 2 2 6.588 2 12.253c0 4.537 2.862 8.369 6.838 9.727.5.09.687-.218.687-.487 0-.243-.013-1.05-.013-1.91C7 20.059 6.35 18.957 6.15 18.38c-.113-.295-.6-1.205-1.025-1.448-.35-.192-.85-.667-.013-.68.788-.012 1.35.744 1.538 1.051.9 1.551 2.338 1.116 2.912.846.088-.666.35-1.115.638-1.371-2.225-.256-4.55-1.14-4.55-5.062 0-1.115.387-2.038 1.025-2.756-.1-.256-.45-1.307.1-2.717 0 0 .837-.269 2.75 1.051.8-.23 1.65-.346 2.5-.346.85 0 1.7.115 2.5.346 1.912-1.333 2.75-1.05 2.75-1.05.55 1.409.2 2.46.1 2.716.637.718 1.025 1.628 1.025 2.756 0 3.934-2.337 4.806-4.562 5.062.362.32.675.936.675 1.897 0 1.371-.013 2.473-.013 2.82 0 .268.188.589.688.486a10.039 10.039 0 0 0 4.932-3.74A10.447 10.447 0 0 0 22 12.253C22 6.588 17.525 2 12 2Z"
              ></path>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
