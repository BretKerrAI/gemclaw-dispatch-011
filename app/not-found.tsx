export const metadata = {
  title: "A page that isn't in the library · Dispatch 011",
};

export default function NotFound() {
  return (
    <main style={{ padding: "18vh 9vw 10vh", minHeight: "100dvh" }}>
      <div className="mono-eyebrow amber" style={{ marginBottom: "2rem" }}>
        DISPATCH 011 · 404 · THE LIBRARY
      </div>
      <h1 className="display" style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", lineHeight: 0.98, marginBottom: "1.5rem" }}>
        This is not<br />one of the books.
      </h1>
      <p className="serif" style={{ fontSize: "1.15rem", opacity: 0.8, maxWidth: "38rem" }}>
        Every adventure the library contains has a permalink. This is not one of them — either a typo, or a book
        that was written and then, as sometimes happens in such places, forgotten.
      </p>
      <p className="mono-eyebrow" style={{ marginTop: "3rem" }}>
        <a href="/" style={{ color: "var(--amber)" }}>← Begin a new one</a>
      </p>
    </main>
  );
}
