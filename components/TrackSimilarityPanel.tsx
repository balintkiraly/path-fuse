"use client";

import { useStore } from "@/lib/store";
import { trackSimilarity } from "@/utils/gpx";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";

function scoreColor(score: number): string {
  if (score >= 85) return "text-teal-600";
  if (score >= 60) return "text-amber-600";
  return "text-slate-500";
}

function scoreBg(score: number): string {
  if (score >= 85) return "bg-teal-100";
  if (score >= 60) return "bg-amber-50";
  return "bg-slate-100";
}

export function TrackSimilarityPanel() {
  const tracks = useStore((state) => state.tracks);

  if (tracks.length < 2) {
    return (
      <aside className="rounded-[var(--radius-card)] border border-slate-200/80 bg-white/70 px-4 py-4 text-sm text-slate-500">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
          Track similarity
        </h2>
        <p>
          Upload at least two tracks to compare how closely they match.
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-[var(--radius-card)] border border-slate-200/80 bg-white/80 shadow-[var(--shadow-card)] px-4 py-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-3">
        Track similarity
      </h2>
      <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
        {tracks.map((t1, i) =>
          tracks.map((t2, j) => {
            if (i >= j) return null;
            const score = trackSimilarity(t1.points, t2.points);
            return (
              <div
                key={`${i}-${j}`}
                className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white/95 px-3 py-2.5 transition-colors hover:bg-slate-50/80"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex-shrink-0">
                  <ArrowsRightLeftIcon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate text-xs">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full align-middle mr-1"
                      style={{ backgroundColor: t1.color }}
                      aria-hidden
                    />
                    {t1.name}
                    <span className="text-slate-400 mx-0.5">↔</span>
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full align-middle mr-1"
                      style={{ backgroundColor: t2.color }}
                      aria-hidden
                    />
                    {t2.name}
                  </p>
                  <span className="text-[11px] text-slate-500">Match score</span>
                </div>
                <span
                  className={`flex items-center justify-center min-w-[2.25rem] h-8 rounded-md font-semibold tabular-nums text-sm ${scoreBg(score)} ${scoreColor(score)}`}
                >
                  {score}%
                </span>
              </div>
            );
          }),
        )}
      </div>
    </aside>
  );
}
