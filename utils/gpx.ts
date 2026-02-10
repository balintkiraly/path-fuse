export const EARTH_RADIUS = 6371;
export interface TrackPoint {
  lat: number;
  lon: number;
  time: number;
  ele?: number;
}

export interface ElevationStats {
  ascentM: number;
  descentM: number;
  minM: number;
  maxM: number;
}

export function elevationStats(
  points: { ele?: number }[],
): ElevationStats | null {
  const withEle = points.filter((p) => p.ele != null) as { ele: number }[];
  if (withEle.length === 0) return null;

  let ascentM = 0;
  let descentM = 0;
  let minM = withEle[0].ele;
  let maxM = withEle[0].ele;

  for (let i = 1; i < withEle.length; i++) {
    const delta = withEle[i].ele - withEle[i - 1].ele;
    if (delta > 0) ascentM += delta;
    else if (delta < 0) descentM += -delta;
    if (withEle[i].ele < minM) minM = withEle[i].ele;
    if (withEle[i].ele > maxM) maxM = withEle[i].ele;
  }
  return { ascentM, descentM, minM, maxM };
}

export const toRadian = (deg: number) => (deg * Math.PI) / 180;

export const haversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const dLat = toRadian(lat2 - lat1);
  const dLon = toRadian(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadian(lat1)) *
      Math.cos(toRadian(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
};

export const removeOutliers = (
  points: { lat: number; lon: number; time: number; ele?: number }[],
  threshold = 10,
) => {
  if (points.length <= 2) return points;

  const clean: typeof points = [];

  for (let i = 0; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    let tooFar = false;

    if (prev && haversine(prev.lat, prev.lon, curr.lat, curr.lon) > threshold) {
      tooFar = true;
    }
    if (next && haversine(curr.lat, curr.lon, next.lat, next.lon) > threshold) {
      tooFar = true;
    }

    if (!tooFar) clean.push(curr);
  }

  return clean;
};

export const totalDistance = (points: { lat: number; lon: number }[]): number => (
  points.slice(1).reduce((acc, curr, i) => {
    const prev = points[i];
    return acc + haversine(prev.lat, prev.lon, curr.lat, curr.lon);
  }, 0)
);

export const duration = (points: { time: number }[]): number => {
  if (points.length < 2) return 0;
  const diffMs = points[points.length - 1].time - points[0].time;
  return diffMs / (1000 * 60 * 60); // hours
};

export const averageSpeed = (
  points: { lat: number; lon: number; time: number }[],
) => {
  const dist = totalDistance(points);
  const dur = duration(points);
  return dur > 0 ? dist / dur : 0;
};

export const trackSimilarity = (
  pointsA: { lat: number; lon: number }[],
  pointsB: { lat: number; lon: number }[],
) => {
  const len = Math.min(pointsA.length, pointsB.length);
  if (len === 0) return 0;

  let totalDist = 0;
  for (let i = 0; i < len; i++) {
    totalDist += haversine(
      pointsA[i].lat,
      pointsA[i].lon,
      pointsB[i].lat,
      pointsB[i].lon,
    );
  }
  const avgDist = totalDist / len;

  // 0-100 (closer = higher)
  const score = Math.max(0, 100 - avgDist * 10);
  return Math.round(score);
};

export const resampleTrack = (
  points: TrackPoint[],
  targetLength: number,
): TrackPoint[] => {
  if (points.length === 0) return [];
  if (points.length === targetLength) return points;

  const resampled: TrackPoint[] = [];
  const step = (points.length - 1) / (targetLength - 1);

  for (let i = 0; i < targetLength; i++) {
    const idx = i * step;
    const low = Math.floor(idx);
    const high = Math.ceil(idx);
    const t = idx - low;

    if (high >= points.length) {
      resampled.push({ ...points[low] });
    } else {
      const lat = points[low].lat + (points[high].lat - points[low].lat) * t;
      const lon = points[low].lon + (points[high].lon - points[low].lon) * t;
      const time =
        points[low].time + (points[high].time - points[low].time) * t;
      const ele =
        points[low].ele != null && points[high].ele != null
          ? points[low].ele! + (points[high].ele! - points[low].ele!) * t
          : undefined;
      resampled.push({ lat, lon, time, ele });
    }
  }
  return resampled;
};

export const interpolateTrack = (
  points: TrackPoint[],
  timestamp: number,
): TrackPoint => {
  if (points.length === 0) return { lat: 0, lon: 0, time: timestamp };
  if (timestamp <= points[0].time) return { ...points[0] };
  if (timestamp >= points[points.length - 1].time)
    return { ...points[points.length - 1] };

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    if (timestamp <= curr.time) {
      const t = (timestamp - prev.time) / (curr.time - prev.time);
      const ele =
        prev.ele != null && curr.ele != null
          ? prev.ele + (curr.ele - prev.ele) * t
          : undefined;
      return {
        lat: prev.lat + (curr.lat - prev.lat) * t,
        lon: prev.lon + (curr.lon - prev.lon) * t,
        time: timestamp,
        ele,
      };
    }
  }

  return { ...points[points.length - 1] };
};

export const mergeTracks = (
  tracks: TrackPoint[][],
  intervalMs = 1000,
): TrackPoint[] => {
  if (tracks.length === 0) return [];

  const cleaned = tracks.map((t) => removeOutliers(t, 10));

  const startTime = Math.min(...cleaned.map((t) => t[0].time));
  const endTime = Math.max(...cleaned.map((t) => t[t.length - 1].time));

  const merged: TrackPoint[] = [];

  for (let t = startTime; t <= endTime; t += intervalMs) {
    let latSum = 0;
    let lonSum = 0;
    let count = 0;

    cleaned.forEach((track) => {
      const pt = interpolateTrack(track, t);
      if (pt) {
        latSum += pt.lat;
        lonSum += pt.lon;
        count++;
      }
    });

    if (count > 0) {
      let eleSum = 0;
      let eleCount = 0;
      cleaned.forEach((track) => {
        const pt = interpolateTrack(track, t);
        if (pt.ele != null) {
          eleSum += pt.ele;
          eleCount++;
        }
      });
      const ele = eleCount > 0 ? eleSum / eleCount : undefined;
      merged.push({
        lat: latSum / count,
        lon: lonSum / count,
        time: t,
        ...(ele != null ? { ele } : {}),
      });
    }
  }

  return merged;
};
