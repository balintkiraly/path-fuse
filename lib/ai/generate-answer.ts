import { generateText } from "ai";
import { getLanguageModel } from "./provider";
import { TrackPoint } from "@/utils/gpx";

export const analyzeGpsErrors = async (track: TrackPoint[]) => {
  const coords = track
    .slice(0, 200)
    .map((p) => `[${p.lat}, ${p.lon}]`)
    .join(", "); // limit for token count

  const prompt = `
  Given these GPS coordinates: ${coords},
  identify points that might be inaccurate due to GPS drops or spikes.
  Explain why and suggest which ones to remove.
  `;

  return await askAi(prompt);
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
