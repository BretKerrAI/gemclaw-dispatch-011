import { SCENE_IDS, SCENE_LABELS } from "@/lib/scenes";

export const metadata = {
  title: "Scene library · Dispatch 011 · GemClaw",
  description: "The 18 animated SVG scenes used by the adventure generator.",
  robots: { index: false, follow: false },
};

export default function ScenesGallery() {
  return (
    <main style={{ padding: "8vh 7vw 12vh", minHeight: "100dvh" }}>
      <div className="mono-eyebrow amber" style={{ marginBottom: "1.25rem" }}>
        DISPATCH 011 · SCENE LIBRARY · 18 FILES
      </div>
      <h1 className="display" style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", marginBottom: "0.75rem" }}>
        The visual grammar.
      </h1>
      <p className="serif" style={{ opacity: 0.72, maxWidth: "40rem", marginBottom: "3.5rem" }}>
        Eighteen prebuilt animated scenes. The generator picks one per node. Each is inline SVG, under 3kb, subtle
        motion only.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {SCENE_IDS.map((id) => (
          <figure
            key={id}
            style={{
              margin: 0,
              border: "1px solid var(--hair)",
              background: "var(--void-lift)",
            }}
          >
            <div style={{ aspectRatio: "5 / 3", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/scenes/${id}.svg`}
                alt={SCENE_LABELS[id]}
                style={{ width: "100%", height: "100%", display: "block" }}
              />
            </div>
            <figcaption
              className="mono-eyebrow"
              style={{
                padding: "0.75rem 1rem",
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                borderTop: "1px solid var(--hair)",
              }}
            >
              <span>{SCENE_LABELS[id]}</span>
              <span style={{ color: "var(--amber)" }}>{id}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mono-eyebrow" style={{ marginTop: "3.5rem", opacity: 0.55 }}>
        <a href="/">← Dispatch 011</a>
      </div>
    </main>
  );
}
