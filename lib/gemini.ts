// Gemini API - 2.5 Flash-Lite for cost. Fallback layer essential (credits depleted 2026-06-11).
// zenmind pattern.

const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

export interface GeminiOptions {
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: 'text/plain' | 'application/json';
  systemInstruction?: string;
}

export class GeminiQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiQuotaError';
  }
}

export async function callGemini(prompt: string, options: GeminiOptions = {}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY missing');
  }
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model,
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.85,
      maxOutputTokens: options.maxOutputTokens ?? 2048,
      ...(options.responseMimeType
        ? { responseMimeType: options.responseMimeType }
        : {}),
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  if (options.systemInstruction) {
    body.systemInstruction = { parts: [{ text: options.systemInstruction }] };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    // 429 RESOURCE_EXHAUSTED = quota or credits depleted
    if (res.status === 429 || /RESOURCE_EXHAUSTED|prepayment credits/i.test(errText)) {
      throw new GeminiQuotaError('Gemini quota/credits exhausted');
    }
    throw new Error(`Gemini API error (${res.status})`);
  }
  const data = await res.json() as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  return text;
}
