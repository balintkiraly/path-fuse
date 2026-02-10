import { mergeTracks, TrackPoint } from "@/utils/gpx";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { tracks }: { tracks: TrackPoint[][] } = await req.json();

  const merged = mergeTracks(tracks);

  return NextResponse.json({ merged });
}
