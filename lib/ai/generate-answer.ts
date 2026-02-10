import { generateText } from "ai";
import { getLanguageModel } from "./provider";
import { TrackPoint } from "@/utils/gpx";


export const aiSuggestTrackCleanup = async (
  track: TrackPoint[],
): Promise<number[]> => {
  const sliced = track.slice(0, parseInt(process.env.MAXIMUM_TRACK_POINTS || "") || 200);
  const payload = sliced.map((p, index) => ({
    index,
    lat: p.lat,
    lon: p.lon,
    time: p.time,
  }));

  const prompt = `
You are given a GPS track as an array of sampled points.

Each point has:
- index: integer position in the original array
- lat: latitude in degrees
- lon: longitude in degrees
- time: timestamp in milliseconds since Unix epoch

Track (JSON):
${JSON.stringify(payload)}

Task:
1. Identify points that are very likely GPS errors (spikes, huge jumps, or short single-point excursions).
2. ONLY return a compact JSON object with this exact shape and nothing else:

{
  "indicesToRemove": [i1, i2, ...]
}

Rules:
- indicesToRemove must be integers from the \"index\" field.
- Prefer to keep more data than to over-delete; be conservative.
- Do NOT include explanations or comments, only the JSON.
`;

  const raw = await askAi(prompt);
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Array.isArray(parsed.indicesToRemove)
    ) {
      return (parsed.indicesToRemove as unknown[])
        .filter((i): i is number => Number.isInteger(i))
        .filter((i) => i >= 0 && i < track.length);
    }
  } catch {
    // fall through to return []
  }
  return [];
};

export async function askAi(userPrompt: string): Promise<string> {
  const model = getLanguageModel();

  const response = await generateText({
    model,
    system:
      "You are a helpful assistant for analyzing GPS track data. You can identify potential inaccuracies in the track and suggest improvements. Be concise and focus on actionable insights.",
    prompt: userPrompt,
  });
  const { text } = response;

  return text;
}
