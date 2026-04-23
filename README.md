# Dispatch 011 — The library that contains every book

A Borgesian Choose Your Own Adventure generator. Part of the [gemclaw.click](https://gemclaw.click) dispatches,
but a separate side of the house from the CodeWatch series (007, 008, 009). Different register, different artifact.

Doctrinal frame: the CodeWatch dispatches are about agents in dialogue with each other. This one is about an LLM
in dialogue with a single user, instantiating Borges's "Garden of Forking Paths" as runtime.

## What it does

1. User fills a five-question form.
2. The server sends the inputs to Claude Opus 4.7 as one generation request.
3. Claude returns a complete JSON tree: ~15 nodes, each with narrative text, 2–3 choices, and a `scene_id`.
4. The tree is persisted with a hash-based permalink.
5. The reader navigates the pre-generated tree instantly — no per-choice API calls.

No per-choice generation. One burst per user, predictable cost, fast after first load.

## Stack

- Next.js 16 App Router on Vercel
- Claude API via `@anthropic-ai/sdk` — server-side only
- `@vercel/kv` for adventure persistence + rate limiting
- No client libraries for animation — SVG + CSS `@keyframes` only

## Layout

```
app/
  page.tsx             landing page (form + Borges frame)
  a/[hash]/page.tsx    adventure reader
  scenes/page.tsx      dev gallery of the 18 SVG scenes
  api/
    generate/          POST: form inputs → Claude → tree → KV → returns hash
    adventure/[hash]/  GET: tree lookup
lib/
  scenes.ts            the 18 scene ids + labels (source of truth)
  prompt.ts            Opus system prompt (externalized)
  tree.ts              tree schema + JSON validator
  kv.ts                persistence wrapper
public/scenes/         the 18 .svg files (inline CSS animation)
```

## Scene library

Eighteen prebuilt animated scenes form the visual grammar. Each is its own `.svg` under 3kb with inline CSS
`@keyframes`. Kentridge not Disney: one subtle motion per scene, nothing that distracts from the text.

The canonical list lives at `lib/scenes.ts`. The generator is constrained to these ids.

## Palette

Matches dispatch 007. Signal Amber `#E8A33D`, Circuit Blue `#2B5ADC`, Void Black `#0B0B0D`, Cream `#F4EFE6`.
Typography: DM Serif Display, Inter, JetBrains Mono.

## Local dev

```
npm install
export ANTHROPIC_API_KEY=sk-ant-...
export KV_REST_API_URL=...
export KV_REST_API_TOKEN=...
npm run dev
```

## Deploy

Deploys as `dispatch-011.gemclaw.click` on Vercel (team scope `bret-kerrs-projects`). New project — KV store is
attached per-project. SSO protection is off (public reader).
