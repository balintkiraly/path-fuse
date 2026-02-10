import { NextRequest, NextResponse } from "next/server";
import { TrackPoint } from "@/utils/gpx";
import { aiSuggestTrackCleanup } from "@/lib/ai/generate-answer";

export async function POST(req: NextRequest) {
  const { track }: { track: TrackPoint[] } = await req.json();

  if (!Array.isArray(track) || track.length === 0) {
    return NextResponse.json(
      { error: "track must be a non-empty array" },
      { status: 400 },
    );
  }

  try {
    const indicesToRemove = await aiSuggestTrackCleanup(track);
    const toRemove = new Set(indicesToRemove);
    const improved = track.filter((_, idx) => !toRemove.has(idx));

    return NextResponse.json({
      improved,
      removedIndices: indicesToRemove,
    });
  } catch (e) {
    console.error("AI improve track failed", e);
    return NextResponse.json(
      { error: "AI track improvement failed" },
      { status: 500 },
    );
  }
}

