import { kv } from "@vercel/kv";
import { createHash } from "node:crypto";
import type { AdventureTree } from "./tree";

export type StoredAdventure = {
  tree: AdventureTree;
  tone: string;
  created_at: number;
};

const ADV_TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year

export function hashTree(tree: AdventureTree): string {
  const json = JSON.stringify(tree);
  return createHash("sha256").update(json).digest("base64url").slice(0, 10);
}

export async function saveAdventure(
  hash: string,
  adventure: StoredAdventure,
): Promise<void> {
  await kv.set(`adv:${hash}`, adventure, { ex: ADV_TTL_SECONDS });
}

export async function loadAdventure(hash: string): Promise<StoredAdventure | null> {
  const raw = await kv.get<StoredAdventure>(`adv:${hash}`);
  return raw ?? null;
}
