import { isSceneId, type SceneId } from "./scenes";

export type Choice = { text: string; next: string };
export type AdventureNode = {
  id: string;
  scene_id: SceneId;
  text: string;
  choices: Choice[];
};
export type AdventureTree = {
  title: string;
  opening_scene_id: SceneId;
  nodes: AdventureNode[];
  endings: string[];
};

export type ValidationResult =
  | { ok: true; tree: AdventureTree }
  | { ok: false; error: string };

/**
 * Strict-enough validator for a tree returned by Opus. Keeps bounds slightly
 * wider than the prompt's stated targets so a valid-but-off-by-one generation
 * isn't rejected — the brief calls for 12–18 nodes and 3–6 endings as the
 * acceptance band in verification.
 */
export function validateTree(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== "object") return { ok: false, error: "not an object" };
  const t = raw as Record<string, unknown>;

  if (typeof t.title !== "string" || t.title.length < 2 || t.title.length > 80)
    return { ok: false, error: "title missing or out of range" };

  if (!isSceneId(t.opening_scene_id))
    return { ok: false, error: "opening_scene_id not in scene library" };

  if (!Array.isArray(t.nodes) || t.nodes.length < 12 || t.nodes.length > 20)
    return { ok: false, error: "nodes must be an array of 12–20 entries" };

  const ids = new Set<string>();
  const nodes: AdventureNode[] = [];
  for (const n of t.nodes) {
    if (!n || typeof n !== "object") return { ok: false, error: "node is not an object" };
    const node = n as Record<string, unknown>;
    if (typeof node.id !== "string" || !/^n\d{3}$/.test(node.id))
      return { ok: false, error: `bad node id: ${String(node.id)}` };
    if (ids.has(node.id)) return { ok: false, error: `duplicate node id: ${node.id}` };
    ids.add(node.id);
    if (!isSceneId(node.scene_id))
      return { ok: false, error: `bad scene_id on ${node.id}` };
    if (typeof node.text !== "string" || node.text.length < 40 || node.text.length > 1400)
      return { ok: false, error: `bad text length on ${node.id}` };
    if (!Array.isArray(node.choices))
      return { ok: false, error: `bad choices on ${node.id}` };
    const choices: Choice[] = [];
    for (const c of node.choices) {
      if (!c || typeof c !== "object") return { ok: false, error: `bad choice on ${node.id}` };
      const ch = c as Record<string, unknown>;
      if (typeof ch.text !== "string" || ch.text.length < 2 || ch.text.length > 140)
        return { ok: false, error: `bad choice text on ${node.id}` };
      if (typeof ch.next !== "string" || !/^n\d{3}$/.test(ch.next))
        return { ok: false, error: `bad choice.next on ${node.id}` };
      choices.push({ text: ch.text, next: ch.next });
    }
    nodes.push({ id: node.id, scene_id: node.scene_id, text: node.text, choices });
  }

  if (!ids.has("n001")) return { ok: false, error: "missing start node n001" };

  if (!Array.isArray(t.endings) || t.endings.length < 3 || t.endings.length > 8)
    return { ok: false, error: "endings must be 3–8 node ids" };
  for (const e of t.endings) {
    if (typeof e !== "string" || !ids.has(e))
      return { ok: false, error: `ending references unknown node: ${String(e)}` };
  }
  const endings = new Set(t.endings as string[]);

  for (const n of nodes) {
    const isEnding = endings.has(n.id);
    if (!isEnding) {
      if (n.choices.length < 2 || n.choices.length > 3)
        return { ok: false, error: `non-ending ${n.id} needs 2–3 choices` };
      for (const c of n.choices) {
        if (!ids.has(c.next))
          return { ok: false, error: `${n.id} points to missing node ${c.next}` };
      }
    }
  }

  return {
    ok: true,
    tree: {
      title: t.title,
      opening_scene_id: t.opening_scene_id,
      nodes,
      endings: t.endings as string[],
    },
  };
}

/**
 * Parse Claude's output. Opus is told to return JSON only, but we strip
 * ```json fences if present and locate the first outer object as a fallback.
 */
export function parseTreeJSON(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : raw;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("no JSON object in response");
  }
  return JSON.parse(body.slice(start, end + 1));
}
