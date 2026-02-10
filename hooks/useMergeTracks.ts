"use client";

import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import type { TrackPoint } from "@/utils/gpx";

async function aiImproveTrackClient(track: TrackPoint[]): Promise<TrackPoint[]> {
  try {
    const res = await fetch("/api/ai-improve-track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track }),
    });
    if (!res.ok) {
      console.warn("AI improve track failed with status", res.status);
      return track;
    }
    const data: { improved?: TrackPoint[] } = await res.json();
    return Array.isArray(data.improved) && data.improved.length > 0
      ? data.improved
      : track;
  } catch (e) {
    console.warn("AI improve track request errored", e);
    return track;
  }
}

interface MergeVariables {
  tracks: TrackPoint[][];
  useAi: boolean;
}

async function mergeTracksApi(
  { tracks, useAi }: MergeVariables,
): Promise<{ merged: TrackPoint[] }> {
  const improvedTracks: TrackPoint[][] = [];
  for (const t of tracks) {
    if (useAi) {
      // Call AI endpoint per track; if it fails, we fall back to original track.
      const improved = await aiImproveTrackClient(t);
      improvedTracks.push(improved);
    } else {
      improvedTracks.push(t);
    }
  }

  const res = await fetch("/api/merge-tracks", {
    method: "POST",
    body: JSON.stringify({ tracks: improvedTracks }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Merge failed");
  return res.json();
}

export function useMergeTracks() {
  const setMergedTrack = useStore((state) => state.setMergedTrack);

  return useMutation({
    mutationFn: mergeTracksApi,
    onSuccess: (data) => {
      setMergedTrack(data.merged);
    },
  });
}
