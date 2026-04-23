"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdventureTree } from "@/lib/tree";
import styles from "./reader.module.css";

type Props = {
  hash: string;
  tree: AdventureTree;
  tone: string;
};

export function AdventureReader({ hash, tree, tone }: Props) {
  const nodeMap = useMemo(() => {
    const m = new Map(tree.nodes.map((n) => [n.id, n]));
    return m;
  }, [tree.nodes]);

  const endingSet = useMemo(() => new Set(tree.endings), [tree.endings]);

  const [currentId, setCurrentId] = useState<string>("n001");
  const [copied, setCopied] = useState(false);

  // Read node id from URL hash on mount + on hashchange.
  useEffect(() => {
    const applyHash = () => {
      const raw = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
      if (raw && /^n\d{3}$/.test(raw) && nodeMap.has(raw)) {
        setCurrentId(raw);
      } else {
        setCurrentId("n001");
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [nodeMap]);

  const choose = useCallback((next: string) => {
    if (typeof window === "undefined") return;
    window.location.hash = next;
  }, []);

  const restart = useCallback(() => {
    if (typeof window === "undefined") return;
    window.location.hash = "n001";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const copyPermalink = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/a/${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }, [hash]);

  const node = nodeMap.get(currentId);
  if (!node) return null; // never — guarded above
  const isEnding = endingSet.has(node.id);

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.permalink}>
          <span className={`mono-eyebrow ${styles.permalinkLabel}`}>PERMALINK</span>
          <code className={`mono ${styles.permalinkValue}`}>
            dispatch-011.gemclaw.click/a/{hash}
          </code>
          <button
            type="button"
            onClick={copyPermalink}
            className={`mono-eyebrow ${styles.copyBtn}${copied ? " " + styles.copied : ""}`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className={`mono-eyebrow ${styles.toneTag}`}>{tone.toUpperCase()}</div>
      </header>

      <figure className={styles.scene} key={node.id /* force remount so animations restart */}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/scenes/${node.scene_id}.svg`}
          alt=""
          aria-hidden="true"
          className={styles.sceneImg}
        />
      </figure>

      <section className={styles.body}>
        <h1 className={`display ${styles.title}`}>{tree.title}</h1>
        <p className={`serif ${styles.text}`}>{node.text}</p>

        {isEnding ? (
          <div className={styles.endingBlock}>
            <div className={`mono-eyebrow ${styles.endingLabel}`}>— AN ENDING</div>
            <button type="button" onClick={restart} className={`mono-eyebrow ${styles.restart}`}>
              Begin again ↺
            </button>
          </div>
        ) : (
          <ul className={styles.choices}>
            {node.choices.map((c, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => choose(c.next)}
                  className={`mono ${styles.choiceBtn}`}
                >
                  <span className={styles.choiceArrow}>→</span>
                  <span>{c.text}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className={styles.footer}>
        <button type="button" onClick={restart} className={`mono-eyebrow ${styles.restartSmall}`}>
          Restart
        </button>
        <span className={`mono-eyebrow ${styles.meta}`}>
          NODE {node.id.toUpperCase()} · DISPATCH 011 · GEMCLAW
        </span>
        <a href="/" className={`mono-eyebrow ${styles.homeLink}`}>
          New adventure ↗
        </a>
      </footer>
    </main>
  );
}
