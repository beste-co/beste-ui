"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "midnight";

interface Card10Line {
  /** Line text (include glyphs like a check mark yourself) */
  text: string;
  /** Commands type character by character; output and success appear at once */
  kind?: "command" | "output" | "success";
}

interface Card10Props {
  /** Window title (e.g. "beste ~ zsh") */
  title?: string;
  /** Lines played in order */
  lines: Card10Line[];
  /** Shell colors: zinc with emerald (default) or slate with sky */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, { shell: string; accent: string }> = {
  dark: { shell: "bg-zinc-950", accent: "text-emerald-400" },
  midnight: { shell: "bg-slate-950", accent: "text-sky-400" },
};

export const card10Demo: Card10Props = {
  title: "beste ~ zsh",
  lines: [
    { kind: "command", text: "npx shadcn@latest init" },
    { kind: "output", text: "Project configured in 0.8s" },
    { kind: "command", text: "npx shadcn add hero-section" },
    { kind: "success", text: "Done. Ship it." },
  ],
};

/**
 * A terminal window card that performs its script on mount: commands type in
 * character by character behind a blinking caret, outputs print at once.
 * Under prefers-reduced-motion the full transcript renders immediately.
 */
export function Card10({ title = "terminal", lines, tone = "dark", className }: Card10Props) {
  const [shown, setShown] = React.useState<string[]>(() => lines.map(() => ""));
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(lines.map((l) => l.text));
      setActive(lines.length);
      return;
    }

    let i = 0;
    let j = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    setShown(lines.map(() => ""));
    setActive(0);

    const step = () => {
      if (cancelled) return;
      const line = lines[i];
      if (!line) {
        setActive(lines.length);
        return;
      }
      if ((line.kind ?? "command") === "command") {
        j++;
        const upto = i;
        const partial = line.text.slice(0, j);
        setShown((prev) => prev.map((s, k) => (k === upto ? partial : s)));
        if (j >= line.text.length) {
          i++;
          j = 0;
          setActive(i);
          timer = setTimeout(step, 350);
        } else {
          timer = setTimeout(step, 28);
        }
      } else {
        const upto = i;
        setShown((prev) => prev.map((s, k) => (k === upto ? (lines[k]?.text ?? "") : s)));
        i++;
        setActive(i);
        timer = setTimeout(step, 220);
      }
    };

    timer = setTimeout(step, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [lines]);

  const styles = toneStyles[tone];
  const finished = active >= lines.length;

  return (
    <div
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-xl border border-white/10 shadow-lg",
        styles.shell,
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-[#febc2e]" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-sm text-white/40">{title}</span>
      </div>

      {/* Transcript */}
      <div className="flex min-h-40 flex-col gap-1.5 p-4 font-mono text-sm leading-relaxed">
        {lines.map((line, k) => {
          const kind = line.kind ?? "command";
          const visible = shown[k] ?? "";
          if (!visible && k !== active) return null;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: transcript order is fixed
              key={k}
              className={cn(
                kind === "command" && "text-white/90",
                kind === "output" && "text-white/50",
                kind === "success" && styles.accent
              )}
            >
              {kind === "command" && (
                <span className={cn("mr-2 select-none", styles.accent)}>$</span>
              )}
              {visible}
              {k === active && kind === "command" && (
                <span
                  aria-hidden="true"
                  className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-white/80 align-middle"
                />
              )}
            </div>
          );
        })}
        {finished && (
          <div className="text-white/90">
            <span className={cn("mr-2 select-none", styles.accent)}>$</span>
            <span
              aria-hidden="true"
              className="inline-block h-3.5 w-1.5 animate-pulse bg-white/80 align-middle"
            />
          </div>
        )}
      </div>
    </div>
  );
}
