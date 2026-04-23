import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  SYSTEM_PROMPT,
  TONE_OPTIONS,
  buildUserMessage,
  type FormInputs,
  type Tone,
} from "@/lib/prompt";
import { parseTreeJSON, validateTree } from "@/lib/tree";
import { hashTree, saveAdventure } from "@/lib/kv";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FIELD_LEN = 240;

function sanitizeField(v: unknown, label: string): string | { error: string } {
  if (typeof v !== "string") return { error: `${label} must be a string` };
  const trimmed = v.trim();
  if (trimmed.length < 1) return { error: `${label} cannot be empty` };
  if (trimmed.length > MAX_FIELD_LEN) return { error: `${label} too long` };
  return trimmed;
}

function parseInputs(body: unknown): FormInputs | { error: string } {
  if (!body || typeof body !== "object") return { error: "body must be an object" };
  const b = body as Record<string, unknown>;

  const place = sanitizeField(b.place, "place");
  if (typeof place !== "string") return place;
  const companion = sanitizeField(b.companion, "companion");
  if (typeof companion !== "string") return companion;
  const collection = sanitizeField(b.collection, "collection");
  if (typeof collection !== "string") return collection;
  const obsession = sanitizeField(b.obsession, "obsession");
  if (typeof obsession !== "string") return obsession;
  const theme_song = sanitizeField(b.theme_song, "theme_song");
  if (typeof theme_song !== "string") return theme_song;

  const tone = typeof b.tone === "string" ? b.tone : "earnest";
  if (!(TONE_OPTIONS as readonly string[]).includes(tone))
    return { error: "tone not recognized" };

  return { place, companion, collection, obsession, theme_song, tone: tone as Tone };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const parsed = parseInputs(body);
  if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });

  const ip = clientIp(req);
  try {
    const rate = await checkRateLimit(ip);
    if (!rate.allowed) {
      const minutes = Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 60000));
      return NextResponse.json(
        {
          error: `The library is rate-limited for this reader. Try again in ~${minutes} minute${minutes === 1 ? "" : "s"}.`,
        },
        { status: 429 },
      );
    }
  } catch {
    // if KV is unreachable, fail open on rate limiting — the generation step
    // will fail independently if KV persistence is down.
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "server not configured (ANTHROPIC_API_KEY)" },
      { status: 500 },
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let rawText: string;
  try {
    const msg = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 8000,
      temperature: 0.8,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(parsed) }],
    });
    const first = msg.content[0];
    if (!first || first.type !== "text") {
      return NextResponse.json({ error: "no text in model response" }, { status: 502 });
    }
    rawText = first.text;
  } catch (e) {
    const err = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: `model call failed: ${err}` }, { status: 502 });
  }

  let parsedJson: unknown;
  try {
    parsedJson = parseTreeJSON(rawText);
  } catch (e) {
    const err = e instanceof Error ? e.message : "parse error";
    return NextResponse.json(
      { error: `could not parse JSON: ${err}` },
      { status: 502 },
    );
  }

  const validation = validateTree(parsedJson);
  if (!validation.ok) {
    return NextResponse.json(
      { error: `tree failed validation: ${validation.error}` },
      { status: 502 },
    );
  }

  const hash = hashTree(validation.tree);
  try {
    await saveAdventure(hash, {
      tree: validation.tree,
      tone: parsed.tone,
      created_at: Date.now(),
    });
  } catch (e) {
    const err = e instanceof Error ? e.message : "kv error";
    return NextResponse.json({ error: `could not persist: ${err}` }, { status: 500 });
  }

  return NextResponse.json({ hash, title: validation.tree.title });
}
