import { LandingForm } from "./landing-form";
import styles from "./landing.module.css";

export default function Landing() {
  return (
    <main className={styles.page}>
      <header className={styles.masthead}>
        <div className="mono-eyebrow amber">DISPATCH 011 · GEMCLAW · APR 2026</div>
        <h1 className={`display ${styles.headline}`}>
          The book that contains every possible version of itself.
        </h1>
        <p className={`serif ${styles.subhead}`}>
          A Borgesian Choose Your Own Adventure generator. Five questions in, an infinite library out.
        </p>
      </header>

      <section className={styles.frame}>
        <div className={`mono-eyebrow ${styles.frameEyebrow}`}>§ 01 · THE LINEAGE</div>
        <div className={styles.frameGrid}>
          <div className={`serif ${styles.frameLead}`}>
            In 1941 Borges imagined a book that contained every possible version of itself. It was fiction.
          </div>
          <div className={`serif ${styles.frameBody}`}>
            <p>
              He called the story "The Garden of Forking Paths." Every choice in the narrative — and every choice the
              narrative did not take — existed simultaneously, in a labyrinth the length of a library. A novel you
              could not finish because it never stopped branching.
            </p>
            <p>
              In 1979 Edward Packard and R.A. Montgomery made a crude, delightful version of this for children. They
              called it Choose Your Own Adventure. Seventy-some volumes. You held a finite paperback that pretended
              to be infinite — you flipped, you chose, you died in a cave, you started again.
            </p>
            <p>
              In 2026 a language model writes the book Borges described, once per reader, in under a minute. The
              library is no longer a fiction or a paperback. It is runtime.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={`mono-eyebrow ${styles.frameEyebrow}`}>§ 02 · FIVE QUESTIONS</div>
        <h2 className={`display ${styles.formHeadline}`}>Answer these, precisely.</h2>
        <p className={`serif ${styles.formIntro}`}>
          The specifics are the seeds. Particulars make the tree feel like yours. Generic answers produce generic
          forests.
        </p>
        <LandingForm />
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <strong>Filed</strong>
            23 April 2026
            <br />
            Franklin, MA
          </div>
          <div>
            <strong>Credits</strong>
            Borges · "El jardín de senderos que se bifurcan" · 1941
            <br />
            Packard &amp; Montgomery · CYOA · 1979
          </div>
          <div>
            <strong>Engine</strong>
            Claude Opus 4.7
            <br />
            One generation per reader
          </div>
          <div>
            <strong>Part of</strong>
            <a href="https://gemclaw.click">the gemclaw.click dispatches ↗</a>
          </div>
        </div>
        <div className={`mono-eyebrow ${styles.footerBottom}`}>
          <span>DISPATCH 011 · THE LIBRARY</span>
          <span>GEMCLAW.CLICK · © MMXXVI</span>
        </div>
      </footer>
    </main>
  );
}
