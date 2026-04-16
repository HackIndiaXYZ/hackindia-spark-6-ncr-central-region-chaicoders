/**
 * Multi-Key Rotation Client for Career Intelligence System
 * LLM: NVIDIA API (openai/gpt-oss-20b) via OpenAI-compatible SDK
 * Market Data: RapidAPI with multi-key rotation
 */
import OpenAI from "openai";

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "bot";
  content: string;
}

// ─── Environment Utils ────────────────────────────────────────────────────────

function getTrimmedEnv(name: string): string | undefined {
  const val = process.env[name];
  return val ? val.trim() : undefined;
}

// ─── LLM Configuration ───────────────────────────────────────────────────────

const GITHUB_TOKEN = process.env.GPT4O_GITHUB_TOKEN; // Restore GPT-4o as general token
const GITHUB_MODEL = process.env.GITHUB_MODEL ?? "gpt-4o";
const GITHUB_BASE_URL = "https://models.inference.ai.azure.com";

const PHI4_TOKEN = process.env.PHI4_GITHUB_TOKEN; // Specialized token for Phi-4
const PHI4_MODEL = process.env.PHI4_MODEL ?? "Phi-4";

const GROK_GITHUB_TOKEN = process.env.GROK_GITHUB_TOKEN;
const GROK_GITHUB_MODEL = process.env.GROK_GITHUB_MODEL ?? "grok3";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const NVIDIA_MODEL    = "openai/gpt-oss-20b";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434/v1";
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || "ollama"; // Usually not needed locally
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama4";

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-1.5-flash"; // Flash is perfect for parsing: fast & cheap

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const ROADMAP_MODEL = "google/gemini-2.0-flash-001"; // Or "anthropic/claude-3.5-sonnet"

function getLLMClient(): { client: OpenAI; model: string } {
  // 1. Prefer Ollama (Llama 4) if specifically set
  if (process.env.OLLAMA_HOST || process.env.OLLAMA_API_KEY) {
    return {
      client: new OpenAI({ 
        apiKey: OLLAMA_API_KEY, 
        baseURL: OLLAMA_HOST,
        dangerouslyAllowBrowser: true
      }),
      model: OLLAMA_MODEL,
    };
  }

  // 2. Fallback to GitHub Models (GPT-4o)
  if (GITHUB_TOKEN && GITHUB_TOKEN.startsWith("github_pat_")) {
    return {
      client: new OpenAI({ 
        apiKey: GITHUB_TOKEN, 
        baseURL: GITHUB_BASE_URL,
        dangerouslyAllowBrowser: true 
      }),
      model: GITHUB_MODEL,
    };
  }

  // 3. Final fallback: NVIDIA
  return {
    client: new OpenAI({ apiKey: NVIDIA_API_KEY, baseURL: NVIDIA_BASE_URL }),
    model: NVIDIA_MODEL,
  };
}

function getPhi4Client(): { client: OpenAI; model: string } {
  // Explicitly for Phi-4 based parsing only
  if (PHI4_TOKEN && PHI4_TOKEN.startsWith("github_pat_")) {
    return {
      client: new OpenAI({ 
        apiKey: PHI4_TOKEN, 
        baseURL: GITHUB_BASE_URL,
        dangerouslyAllowBrowser: true 
      }),
      model: PHI4_MODEL,
    };
  }
  return getLLMClient();
}

function getMarketLLMClient(): { client: OpenAI; model: string } {
  // Always use the OpenAI model (GPT-4o) for market intelligence as requested
  if (GITHUB_TOKEN && GITHUB_TOKEN.startsWith("github_pat_")) {
    return {
      client: new OpenAI({ apiKey: GITHUB_TOKEN, baseURL: GITHUB_BASE_URL }),
      model: GITHUB_MODEL,
    };
  }
  // Fallback to Grok only if GPT-4o is missing
  if (GROK_GITHUB_TOKEN && GROK_GITHUB_TOKEN.startsWith("github_pat_")) {
    return {
      client: new OpenAI({ apiKey: GROK_GITHUB_TOKEN, baseURL: GITHUB_BASE_URL }),
      model: GROK_GITHUB_MODEL,
    };
  }
  return getLLMClient();
}

function getOpenRouterClient(): { client: OpenAI; model: string } {
  if (OPENROUTER_API_KEY) {
    return {
      client: new OpenAI({ 
        apiKey: OPENROUTER_API_KEY, 
        baseURL: OPENROUTER_BASE_URL,
        dangerouslyAllowBrowser: true 
      }),
      model: ROADMAP_MODEL,
    };
  }
  return getLLMClient();
}

function getRapidApiKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const key = getTrimmedEnv(`RAPIDAPI_KEY_${i}`);
    if (key) keys.push(key);
  }
  const legacyKey = getTrimmedEnv("RAPIDAPI_KEY");
  if (legacyKey && !keys.includes(legacyKey)) {
    keys.push(legacyKey);
  }
  return [...new Set(keys)];
}

// ─── Timeout Utility ──────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`[TIMEOUT] ${label} exceeded ${ms}ms`));
    }, ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

// ─── RapidAPI Fetch ───────────────────────────────────────────────────────────

export interface RapidApiRequestOptions {
  url: string;
  host: string;
  timeoutMs?: number;
}

export async function fetchWithKeyRotation(opts: RapidApiRequestOptions): Promise<any | null> {
  const keys = getRapidApiKeys();
  const timeout = opts.timeoutMs ?? 10000;
  if (!keys.length) return null;
  let lastError: any;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const fetchPromise = fetch(opts.url, {
        headers: { "x-rapidapi-host": opts.host, "x-rapidapi-key": key }
      });
      const res = await withTimeout(fetchPromise, timeout, `RapidAPI/${opts.host}`);
      if (res.status === 429 || res.status === 401 || res.status === 403) continue;
      if (!res.ok) continue;
      return await res.json();
    } catch (err) { lastError = err; }
  }
  return null;
}

// ─── LLM Service ──────────────────────────────────────────────────────────────

async function _runChatCompletion(client: OpenAI, model: string, messages: ChatMessage[]): Promise<string> {
  const normalized = messages.map((m) => ({
    role: (m.role === "bot" ? "assistant" : m.role) as "system" | "user" | "assistant",
    content: m.content,
  }));

  // Collect streamed chunks into a single string
  const stream = await client.chat.completions.create({
    model: model,
    messages: normalized,
    temperature: 1,
    top_p: 1,
    max_tokens: 4096,
    stream: true,
  });

  let result = "";
  for await (const chunk of stream) {
    // Some reasoning models emit a separate reasoning_content field; include both
    const delta = chunk.choices[0]?.delta as any;
    if (delta?.reasoning_content) result += delta.reasoning_content;
    result += delta?.content ?? "";
  }

  if (!result) throw new Error("Model returned an empty response.");
  return result;
}

export async function chatWithLLMWithFallback(
  messages: ChatMessage[],
  _timeoutMs = 25000   // kept for API compatibility, NVIDIA SDK handles its own timeout
): Promise<string> {
  const { client, model } = getLLMClient();
  return _runChatCompletion(client, model, messages);
}

export async function chatWithMarketLLM(
  messages: ChatMessage[],
  _timeoutMs = 25000
): Promise<string> {
  const { client, model } = getMarketLLMClient();
  return _runChatCompletion(client, model, messages);
}

export async function chatWithRoadmapLLM(
  messages: ChatMessage[],
  _timeoutMs = 45000
): Promise<string> {
  const { client, model } = getOpenRouterClient();
  return _runChatCompletion(client, model, messages);
}

// ─── Jobs Service ─────────────────────────────────────────────────────────────

export async function fetchLinkedInJobs(role: string, limit = 40): Promise<any[]> {
  const json = await fetchWithKeyRotation({
    url: `https://linkedin-job-search-api.p.rapidapi.com/active-jb-1h?limit=${limit}&offset=0&title_filter=${encodeURIComponent(`"${role}"`)}&description_type=text`,
    host: "linkedin-job-search-api.p.rapidapi.com"
  });
  if (!json) return [];
  const raw: any[] = Array.isArray(json) ? json : (json.data ?? []);
  return raw.map((j: any) => ({
    title: j.job_title || j.title || "",
    company: j.company_name || j.company || "Unknown",
    location: j.job_location || j.location || "Remote",
    description: (j.job_description || j.description || "").substring(0, 600),
    min_salary: j.salary_min ?? j.min_salary,
    max_salary: j.salary_max ?? j.max_salary,
  })).filter((j) => j.title);
}

export async function parseResumeWithLLM(text: string, systemPrompt: string): Promise<Record<string, any>> {
  const { client, model } = getPhi4Client();
  console.log(`[PARSE_RESUME] Using Phi-4 specialized model for extraction...`);

  const llmResponse = await _runChatCompletion(client, model, [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Resume Content:\n\n${text}` }
  ]);

  try {
    const cleaned = llmResponse
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[PARSE_LLM] Failed to parse JSON:", llmResponse);
    throw new Error("LLM returned invalid JSON format.");
  }
}
