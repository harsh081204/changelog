import dotenv from 'dotenv'
import Groq from "groq-sdk";

dotenv.config()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type ChangeType = "FEATURE" | "BUGFIX" | "BREAKING" | "INTERNAL";

export interface Change {
  type: ChangeType;
  summary: string;
  files: string[];
}

export interface ClassifyResult {
  entryTitle: string;
  suggestedVersion: "patch" | "minor" | "major";
  changes: Change[];
}

interface ClassifyInput {
  prTitle: string;
  prDescription: string;
  diffText: string;
}

export async function classifyChanges(input: ClassifyInput): Promise<ClassifyResult> {
  const prompt = buildPrompt(input);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", 
    temperature: 0.2,                   
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: `You are a technical writer that converts GitHub pull request diffs 
into clean, user-facing changelog entries. You write for developers who USE this 
software, not the developers who built it.

Rules:
- Be specific and concrete. Never write "various improvements" or "minor fixes".
- Every change must be understandable without reading the code.
- Write summaries in present tense: "Adds X", "Fixes Y when Z", "Removes X".
- You MUST respond with only valid JSON. No explanation. No markdown fences. No extra text.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";

  return parseResponse(raw, input.prTitle);
}

function buildPrompt(input: ClassifyInput): string {
  return `Analyze this pull request and return ONLY valid JSON.

PR Title: ${input.prTitle}
PR Description: ${input.prDescription || "No description provided."}

Diff:
${input.diffText}

Return this exact JSON shape:
{
  "entryTitle": "brief title for this release (max 60 chars)",
  "suggestedVersion": "patch | minor | major",
  "changes": [
    {
      "type": "FEATURE | BUGFIX | BREAKING | INTERNAL",
      "summary": "one user-facing sentence — what changed and why it matters",
      "files": ["affected/file.ts"]
    }
  ]
}

Version rules:
- "major" → any BREAKING change present
- "minor" → any FEATURE present, no BREAKING
- "patch" → only BUGFIX or INTERNAL changes

Change type rules:
- FEATURE  → new capability users can use
- BUGFIX   → something broken that now works  
- BREAKING → requires user action to upgrade
- INTERNAL → refactor, test, CI — real but not user-facing`;
}

function parseResponse(raw: string, fallbackTitle: string): ClassifyResult {
  try {
    const clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(clean);

    if (!parsed.entryTitle || !parsed.suggestedVersion || !Array.isArray(parsed.changes)) {
      throw new Error("Invalid shape");
    }

    return parsed as ClassifyResult;
  } catch {
    console.error("LLM parse failed, using fallback. Raw output:", raw);
    return {
      entryTitle: fallbackTitle,
      suggestedVersion: "patch",
      changes: [
        {
          type: "INTERNAL",
          summary: fallbackTitle,
          files: [],
        },
      ],
    };
  }
}