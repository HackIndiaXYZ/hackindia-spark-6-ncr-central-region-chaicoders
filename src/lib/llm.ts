/**
 * LLM Gateway wrapper — now backed by the multi-key rotation client.
 * All callers of `chatWithLLM` automatically get key-rotation + timeout fallback.
 */
export type { ChatMessage } from "./api-client";
export { chatWithLLMWithFallback as chatWithLLM, chatWithMarketLLM, chatWithRoadmapLLM } from "./api-client";
