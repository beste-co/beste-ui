"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "type" | "output" | "done";

interface Code20Props {
  title?: string;
  command?: string;
  /** Output lines that appear one by one after the command runs. */
  lines?: string[];
  result?: string;
  duration?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  /** Stretch the card over its whole slot, so it can match a neighbouring card's height. */
  fill?: boolean;
  stepMs?: number;
  className?: string;
}

export const code20Demo: Code20Props = {
  title: "~/acme-web",
  command: "npx acme deploy",
  lines: ["Linked to acme/web", "Installed 214 packages", "Built 38 pages", "Uploaded to 12 regions"],
  result: "Live at https://acme.dev",
  duration: "41s",
  framed: true,
  stepMs: 800,
};

/* Typing speed for the command, in milliseconds per character. */
const CHAR_MS = 70;
/* Steps between output lines. */
const LINE_HOLD = 0.8;

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "type", type: "output", output: "done", done: "rest" };
/* `type` and `output` are sized from the command and the line count instead. */
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 0.8, type: 0, output: 0, done: 0.6 };

/* The card is drawn at a fixed width and scaled down to fit small slots, so its proportions never change. */
function useFitScale(fill: boolean) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [entrance, setEntrance] = useState<{ shown: boolean; delay: number; still: boolean }>({
    shown: false,
    delay: 0,
    still: false,
  });

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const update = () => {
      const cs = getComputedStyle(o);
      const w = o.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const h = o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (fill) {
        /* A slot that has not been laid out yet measures 0, which would divide 0 by 0; wait for the next resize. */
        if (w <= 0 || h <= 0) return;
        /* Keep the w-md type scale, but draw the card at the slot's size divided by it so it covers the slot. */
        const s = Math.min(1, w / (28 * parseFloat(getComputedStyle(document.documentElement).fontSize)));
        setScale(s);
        setSize({ width: w / s, height: h / s });
        return;
      }
      setScale(Math.min(1, w / i.offsetWidth, h > 0 ? h / i.offsetHeight : 1));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(o);
    /* Rise in the first time the slot scrolls into view; slots further right arrive a beat later. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const left = entry.boundingClientRect.left / Math.max(window.innerWidth, 1);
        setEntrance({ shown: true, delay: Math.round(Math.min(Math.max(left, 0), 1) * 360), still });
        seen.disconnect();
      },
      { threshold: 0.3 }
    );
    seen.observe(o);
    return () => {
      observer.disconnect();
      seen.disconnect();
    };
  }, [fill]);

  return { outer, inner, scale, size, entrance: { ...entrance, shown: entrance.shown && scale !== null } };
}
export function Code20({
  title,
  command = "",
  lines = [],
  result,
  duration,
  framed = true,
  fill = false,
  stepMs = 800,
  className,
}: Code20Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const [typed, setTyped] = useState(command.length);
  const [shown, setShown] = useState(lines.length);
  const { outer, inner, scale, size, entrance } = useFitScale(fill);

  useEffect(() => {
    const ms =
      phase === "type"
        ? command.length * CHAR_MS + stepMs * 0.5
        : phase === "output"
          ? (lines.length + 0.3) * LINE_HOLD * stepMs
          : HOLD[phase] * stepMs;
    const id = setTimeout(() => setPhase(NEXT[phase]), ms);
    return () => clearTimeout(id);
  }, [phase, stepMs, command.length, lines.length]);

  /* The command types out, then its output settles one line at a time. */
  useEffect(() => {
    if (phase === "reset") {
      setTyped(0);
      setShown(0);
      return;
    }
    if (phase === "type") {
      const id = setInterval(() => setTyped((count) => Math.min(count + 1, command.length)), CHAR_MS);
      return () => clearInterval(id);
    }
    setTyped(command.length);
    if (phase === "output") {
      const id = setInterval(() => setShown((count) => Math.min(count + 1, lines.length)), LINE_HOLD * stepMs);
      return () => clearInterval(id);
    }
    setShown(lines.length);
  }, [phase, stepMs, command.length, lines.length]);

  const finished = phase === "done" || phase === "rest";
  const typing = phase === "reset" || phase === "type";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", fill && "p-0", className)}>
      <style>{`
@keyframes code20-caret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
.code20-caret { animation: code20-caret 1000ms steps(1) infinite; }
@media (prefers-reduced-motion: reduce) { .code20-caret { animation: none; } }
`}</style>
      <div
        ref={inner}
        className={cn(
          "w-md shrink-0",
          fill && "flex flex-col",
          framed && "rounded-2xl border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
        style={{
          ...(fill && size ? { width: size.width, height: size.height } : {}),
          transform: `scale(${scale ?? 1})`,
          opacity: entrance.shown ? 1 : 0,
          translate: entrance.shown ? "0 0" : "0 1.25rem",
          filter: entrance.shown ? "blur(0px)" : "blur(10px)",
          transition: entrance.still
            ? "none"
            : "opacity 1000ms ease-out, translate 1400ms cubic-bezier(0.16, 1, 0.3, 1), filter 1000ms ease-out",
          transitionDelay: `${entrance.delay}ms`,
        }}
      >
        <div
          className={cn(
            "overflow-hidden rounded-lg bg-card text-card-foreground shadow-xs",
            fill && "flex flex-1 flex-col"
          )}
        >
          <div className="flex items-center gap-3 border-b border-border bg-muted px-3 py-2">
            <span className="flex gap-1" aria-hidden="true">
              <span className="size-2 rounded-full bg-foreground/15" />
              <span className="size-2 rounded-full bg-foreground/15" />
              <span className="size-2 rounded-full bg-foreground/15" />
            </span>
            <span className="flex-1 truncate text-center text-sm text-muted-foreground">{title}</span>
            <span className="w-8" aria-hidden="true" />
          </div>

          <div className={cn("px-5 py-5 font-mono text-sm leading-7", fill && "flex flex-1 flex-col")}>
            <p className="whitespace-pre">
              <span className="text-muted-foreground">$ </span>
              {command.slice(0, typed)}
              <span
                aria-hidden="true"
                className={cn(
                  "code20-caret ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-foreground/70",
                  typing ? "visible" : "invisible"
                )}
              />
            </p>
            <ul className={cn("mt-1", fill && "mb-4")}>
              {lines.map((line, index) => (
                <li
                  key={index}
                  className={cn(
                    "truncate text-muted-foreground transition-opacity duration-300 motion-reduce:transition-none",
                    index < shown ? "opacity-100" : "opacity-0"
                  )}
                >
                  {line}
                </li>
              ))}
            </ul>
            <div
              className={cn(
                "mt-4 flex items-center gap-2.5 border-t border-border pt-4 transition-all duration-500 ease-out motion-reduce:transition-none",
                fill && "mt-auto",
                finished ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              )}
            >
              <span
                className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                aria-hidden="true"
              >
                <Check className="size-2.5" />
              </span>
              <span className="flex-1 truncate text-foreground">{result}</span>
              <span className="tabular-nums text-muted-foreground">{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
