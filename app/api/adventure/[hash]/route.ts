import { NextResponse } from "next/server";
import { loadAdventure } from "@/lib/kv";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  const { hash } = await params;
  if (!/^[A-Za-z0-9_-]{6,16}$/.test(hash)) {
    return NextResponse.json({ error: "bad hash" }, { status: 400 });
  }

  let adventure;
  try {
    adventure = await loadAdventure(hash);
  } catch (e) {
    const err = e instanceof Error ? e.message : "kv error";
    return NextResponse.json({ error: `lookup failed: ${err}` }, { status: 500 });
  }

  if (!adventure) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json(adventure, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
