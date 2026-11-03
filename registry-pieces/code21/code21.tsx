"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "mark" | "comment" | "approve";

interface DiffLine {
  kind: "add" | "remove" | "context";
  text: string;
}

interface Code21Props {
  title?: string;
  file?: string;
  lines?: DiffLine[];
  /** Index of the line the reviewer leaves a note on. */
  noteOn?: number;
  reviewer?: { name: string; avatar: { src: string; alt: string } };
  comment?: string;
  pendingLabel?: string;
  approvedLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const code21Demo: Code21Props = {
  title: "Make sync retries configurable",
  file: "src/sync/retry.ts",
  lines: [
    { kind: "context", text: "export function retry(task: Task) {" },
    { kind: "remove", text: "  const max = 3;" },
    { kind: "add", text: "  const max = config.retries ?? 3;" },
    { kind: "context", text: "  return run(task, max);" },
  ],
  noteOn: 2,
  reviewer: {
    name: "Leonard Cohen",
    avatar: {
      src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Smiling man in a floral shirt",
    },
  },
  comment: "Nice and small. Maybe call it retryLimit so it reads well in the config? Happy to ship either way.",
  pendingLabel: "In review",
  approvedLabel: "Approved",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "mark", mark: "comment", comment: "approve", approve: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1, mark: 0.9, comment: 1.8, approve: 0.6 };

const SIGN: Record<DiffLine["kind"], string> = { add: "+", remove: "-", context: " " };
const LINE: Record<DiffLine["kind"], string> = {
  add: "bg-emerald-500/10",
  remove: "bg-rose-500/10 text-muted-foreground",
  context: "",
};

/* The card is drawn at a fixed width and scaled down to fit small slots, so its proportions never change. */
function useFitScale() {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
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
  }, []);

  return { outer, inner, scale, entrance: { ...entrance, shown: entrance.shown && scale !== null } };
}

export function Code21({
  title,
  file,
  lines = [],
  noteOn = 0,
  reviewer,
  comment,
  pendingLabel,
  approvedLabel,
  framed = true,
  stepMs = 900,
  className,
}: Code21Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const marked = phase !== "reset";
  const commented = phase === "comment" || phase === "approve" || phase === "rest";
  const approved = phase === "approve" || phase === "rest";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className={cn(
          "w-md shrink-0",
          framed && "rounded-2xl border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
        style={{
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
        <div className="rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-lg tracking-tight">{title}</p>
              <p className="truncate text-sm text-muted-foreground">{file}</p>
            </div>
            <span className="relative mt-0.5 grid shrink-0 justify-items-end text-sm">
              <span
                className={cn(
                  "col-start-1 row-start-1 inline-flex h-7 items-center rounded-md bg-muted px-2.5 text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                  approved ? "opacity-0" : "opacity-100"
                )}
              >
                {pendingLabel}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 inline-flex h-7 items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 text-emerald-700 transition-all duration-500 motion-reduce:transition-none dark:text-emerald-400",
                  approved ? "scale-100 opacity-100" : "scale-95 opacity-0"
                )}
              >
                <Check className="size-3.5" aria-hidden="true" />
                {approvedLabel}
              </span>
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-md border border-border py-1.5">
            {lines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  "relative flex h-7 items-center gap-3 px-3 font-mono text-sm",
                  LINE[line.kind]
                )}
              >
                <span className="w-2 shrink-0 text-muted-foreground" aria-hidden="true">
                  {SIGN[line.kind]}
                </span>
                <span className="min-w-0 flex-1 truncate whitespace-pre">{line.text}</span>
                {index === noteOn && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 shrink-0 rounded-full bg-primary transition-all duration-500 motion-reduce:transition-none",
                      marked ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* The note keeps its space so the card never changes height. */}
          {reviewer && (
            <div
              className={cn(
                "mt-4 flex gap-3 transition-all duration-700 ease-out motion-reduce:transition-none",
                commented ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
              )}
            >
              <img src={reviewer.avatar.src} alt={reviewer.avatar.alt} className="size-8 shrink-0 rounded-md object-cover" />
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{reviewer.name}</p>
                <p className="mt-0.5 text-base leading-snug">{comment}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
