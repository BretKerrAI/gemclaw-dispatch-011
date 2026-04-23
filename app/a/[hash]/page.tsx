import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadAdventure } from "@/lib/kv";
import { AdventureReader } from "./reader";

type RouteParams = { hash: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { hash } = await params;
  const adv = await loadAdventure(hash).catch(() => null);
  if (!adv) return { title: "Adventure not found · Dispatch 011" };
  return {
    title: `${adv.tree.title} · Dispatch 011 · GemClaw`,
    description: "An adventure generated in the library that contains every book.",
    openGraph: {
      title: `${adv.tree.title} · Dispatch 011`,
      description: "An adventure from the library that contains every book.",
      url: `https://dispatch-011.gemclaw.click/a/${hash}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${adv.tree.title} · Dispatch 011`,
      description: "An adventure from the library that contains every book.",
    },
  };
}

export default async function AdventurePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { hash } = await params;
  if (!/^[A-Za-z0-9_-]{6,16}$/.test(hash)) notFound();
  const adv = await loadAdventure(hash).catch(() => null);
  if (!adv) notFound();

  return <AdventureReader hash={hash} tree={adv.tree} tone={adv.tone} />;
}
