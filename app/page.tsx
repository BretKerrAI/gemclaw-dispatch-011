export default function LandingPlaceholder() {
  return (
    <main style={{ padding: "12vh 9vw", minHeight: "100dvh" }}>
      <div className="mono-eyebrow amber" style={{ marginBottom: "2rem" }}>
        DISPATCH 011 · GEMCLAW · FORTHCOMING
      </div>
      <h1 className="display" style={{ fontSize: "clamp(3rem, 10vw, 7rem)", lineHeight: 0.98 }}>
        The book that contains<br />every possible version<br />of itself.
      </h1>
      <p className="serif" style={{ marginTop: "2.5rem", fontSize: "1.2rem", maxWidth: "42rem", opacity: 0.8 }}>
        A Borgesian Choose Your Own Adventure generator. Wiring in progress.
      </p>
      <div className="mono-eyebrow" style={{ marginTop: "4rem", opacity: 0.55 }}>
        <a href="/scenes">Scene library →</a>
      </div>
    </main>
  );
}
