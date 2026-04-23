import { SCENE_IDS } from "./scenes";

export const TONE_OPTIONS = ["earnest", "noir", "absurd", "melancholic", "spy-voiced"] as const;
export type Tone = (typeof TONE_OPTIONS)[number];

export const TONE_GUIDANCE: Record<Tone, string> = {
  earnest:
    "Literary, warm, direct. No irony armor. Emotionally precise. Think Le Guin's clear water.",
  noir:
    "Clipped, shadowed, first-person close. Streetlight and cigarette smoke. Unreliable weather. Chandler via Borges.",
  absurd:
    "Dreamlike non-sequitur treated as fact. Calvino in a hurry. Objects that misbehave without comment. Never winking.",
  melancholic:
    "Autumnal, quiet, past tense feeling even in present tense. Things slightly already missed. Sebald in a thinner jacket.",
  "spy-voiced":
    "The GemClaw SPY register: terse editorial, light capitals, italic marginalia energy. Dispatches, not adventures. Declarative.",
};

export type FormInputs = {
  place: string;
  companion: string;
  collection: string;
  obsession: string;
  theme_song: string;
  tone: Tone;
};

export const SYSTEM_PROMPT = `You are generating a Choose Your Own Adventure narrative tree in the lineage of Borges's "Garden of Forking Paths" and the 1979 CYOA series. Output valid JSON — and only JSON — matching the schema below. No prose before or after the JSON.

The story should feel personal to the user's form inputs but MUST NOT name them directly or echo them verbatim. The user is the protagonist, addressed as "you." Narrative beats should echo Borges, Calvino, Le Guin, Angela Carter — literary, slightly uncanny, emotionally precise. Not cartoonish. Not generic fantasy.

Each node's text is 80–140 words, second person, present tense. Each node offers 2 or 3 choices. Choice labels are 4–8 words, imperative or declarative, never a question. Every choice label should promise a distinct direction — no two labels on the same node should feel interchangeable.

Tree structure:
- 15 total nodes (id: "n001" ... "n015")
- start node is always "n001"
- 3 layers deep from the start (some paths shorter, some longer — not a balanced binary tree)
- 4 to 6 endings (terminal nodes, listed in "endings" array, which must be a subset of node ids)
- At least one ending must be emotionally ambiguous rather than a clean win or loss
- Endings feel earned, not arbitrary. The final node's text names what has changed.
- Every "next" id must refer to a node that exists in "nodes"
- Paths may reconverge (two branches lead to the same node) — this is encouraged, sparingly

Scene ids MUST come from this exact set (use only these strings in scene_id fields):
${SCENE_IDS.map((s) => `- ${s}`).join("\n")}

Schema:
{
  "title": "<evocative 2–5 word title>",
  "opening_scene_id": "<one of the scene_ids above>",
  "nodes": [
    {
      "id": "n001",
      "scene_id": "<scene_id>",
      "text": "<80–140 words, second person>",
      "choices": [
        { "text": "<4–8 words>", "next": "n002" },
        { "text": "<4–8 words>", "next": "n003" }
      ]
    }
  ],
  "endings": ["<node id>", "<node id>"]
}

Rules for the text:
- Never use "the user" or address the user by any name.
- Never mention "AI", "the model", "generated", or meta language about the adventure.
- Don't enumerate the form inputs back. Let them shape atmosphere, not labels.
- No dice rolls, stats, inventories, or game mechanics. This is a story tree.
- No trailing "THE END" markers on endings. The final text carries the weight.`;

export function buildUserMessage(inputs: FormInputs): string {
  const guidance = TONE_GUIDANCE[inputs.tone];
  return `Generate the tree now. Use these inputs as atmospheric seeds — do not quote or name them:

- A place that felt like another world: ${inputs.place}
- A companion for the quest: ${inputs.companion}
- A collection that shouldn't be useful but is: ${inputs.collection}
- A childhood obsession not outgrown: ${inputs.obsession}
- A theme song for walking into a boss fight: ${inputs.theme_song}

Tone register: ${inputs.tone}
Tone guidance: ${guidance}

Output JSON only.`;
}
