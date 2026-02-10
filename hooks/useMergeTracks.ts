"use client";

import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import type { TrackPoint } from "@/utils/gpx";

async function mergeTracksApi(tracks: TrackPoint[][]): Promise<{ merged: TrackPoint[] }> {
  const res = await fetch("/api/merge-tracks", {
    method: "POST",
    body: JSON.stringify({ tracks }),
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
