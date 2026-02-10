import { create } from "zustand";

interface ElevationStats {
  ascentM: number;
  descentM: number;
  minM: number;
  maxM: number;
}

interface TrackStats {
  distanceKm: number;
  durationH: number;
  avgSpeed: number;
  elevation?: ElevationStats;
}

interface TrackPoint {
  lat: number;
  lon: number;
  time: number;
  ele?: number;
}

interface Track {
  name: string;
  points: TrackPoint[];
  color: string;
  stats?: TrackStats;
}

interface PathFuseState {
  tracks: Track[];
  mergedTrack: TrackPoint[];
  addTrack: (track: Track) => void;
  setMergedTrack: (track: TrackPoint[]) => void;
}

export const useStore = create<PathFuseState>((set) => ({
  tracks: [],
  mergedTrack: [],
  addTrack: (track) => set((state) => ({ tracks: [...state.tracks, track] })),
  setMergedTrack: (track) => set({ mergedTrack: track }),
}));
