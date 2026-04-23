"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TONE_OPTIONS } from "@/lib/prompt";
import styles from "./landing-form.module.css";

const FIELDS: { name: string; label: string; placeholder: string }[] = [
  {
    name: "place",
    label: "A place you've been that felt like another world.",
    placeholder: "the overnight ferry between Piraeus and Chios",
  },
  {
    name: "companion",
    label: "A person you'd bring on a quest — real or fictional.",
    placeholder: "my grandmother, age forty",
  },
  {
    name: "collection",
    label: "A thing you collect that shouldn't be useful but is.",
    placeholder: "expired transit cards from cities I'll never return to",
  },
  {
    name: "obsession",
    label: "An obsession from childhood you still haven't outgrown.",
    placeholder: "maps of imaginary subway systems",
  },
  {
    name: "theme_song",
    label: "Your theme song for walking into a boss fight.",
    placeholder: "Nina Simone, 'Sinnerman', the long version",
  },
];

type State = "idle" | "submitting" | "error";

export function LandingForm() {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setState("submitting");
    setError(null);

    const fd = new FormData(ev.currentTarget);
    const body: Record<string, string> = { tone: "earnest" };
    for (const [k, v] of fd.entries()) body[k] = typeof v === "string" ? v : "";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setState("error");
        setError(json?.error ?? `generation failed (${res.status})`);
        return;
      }
      if (typeof json?.hash !== "string") {
        setState("error");
        setError("malformed response");
        return;
      }
      router.push(`/a/${json.hash}`);
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "network error");
    }
  }

  const disabled = state === "submitting";

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {FIELDS.map((f) => (
        <label key={f.name} className={styles.field}>
          <span className={`serif ${styles.label}`}>{f.label}</span>
          <input
            type="text"
            name={f.name}
            required
            maxLength={240}
            autoComplete="off"
            placeholder={f.placeholder}
            disabled={disabled}
            className={`mono ${styles.input}`}
          />
        </label>
      ))}

      <label className={styles.field}>
        <span className={`serif ${styles.label}`}>Tone register.</span>
        <select name="tone" defaultValue="earnest" disabled={disabled} className={`mono ${styles.select}`}>
          {TONE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.submitRow}>
        <button type="submit" disabled={disabled} className={`mono-eyebrow ${styles.submit}`}>
          {state === "submitting" ? "Opening the library…" : "Enter the library."}
        </button>
        {state === "submitting" && (
          <span className={`mono-eyebrow ${styles.hint}`}>~30–60s · one generation · no going back</span>
        )}
        {state === "error" && error && (
          <span className={`mono-eyebrow ${styles.errorMsg}`}>{error}</span>
        )}
      </div>
    </form>
  );
}
