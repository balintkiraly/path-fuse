import type { LanguageModelV3 } from "@ai-sdk/provider";
import { createOpenAI } from "@ai-sdk/openai";

const provider = process.env.AI_PROVIDER || "openai";
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiApiBaseURL = process.env.OPENAI_API_BASE_URL;

function getOpenAIModel(): LanguageModelV3 {
  if (!openaiApiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local to enable AI features in the landing page editor.",
    );
  }
  const openai = createOpenAI({
    apiKey: openaiApiKey,
    baseURL: openaiApiBaseURL
  });

  const modelId = process.env.AI_MODEL || "gpt-4o-mini";
  return openai(modelId);
}

export function getLanguageModel(): LanguageModelV3 {
  switch (provider) {
    case "openai":
      return getOpenAIModel();
    default:
      throw new Error(
        `Unsupported AI_PROVIDER: ${provider}. Supported: openai. Add others in lib/ai/provider.ts.`,
      );
  }
}

export function isAiConfigured(): boolean {
  if (provider === "openai") return Boolean(openaiApiKey);
  return false;
}
