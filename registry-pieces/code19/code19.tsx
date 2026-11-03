"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "approved" | "clear" | "focus" | "comment" | "approach" | "press" | "result";

type LineKind = "context" | "removed" | "added";

interface DiffLine {
  kind: LineKind;
  text: string;
}

interface ReviewComment {
  author: string;
  avatar: { src: string; alt: string };
  body: string;
}

interface Code19Props {
  fileName?: string;
  lines?: DiffLine[];
  /** Index of the line the comment points at. */
  commentLine?: number;
  comment?: ReviewComment;
  /** Button the reviewer presses; it turns into `approvedLabel`. */
  approveLabel?: string;
  approvedLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  /** Name on the cursor that presses approve. */
  cursorLabel?: string;
  stepMs?: number;
  className?: string;
}

export const code19Demo: Code19Props = {
  fileName: "deploy.ts",
  lines: [
    { kind: "context", text: "export async function ship(env: string) {" },
    { kind: "removed", text: "  const url = await build(env);" },
    { kind: "removed", text: "  return publish(url);" },
    { kind: "added", text: "  const out = await build(env, { cache: true });" },
    { kind: "added", text: "  return publish(out.url, { preview: true });" },
    { kind: "context", text: "}" },
  ],
  commentLine: 3,
  comment: {
    author: "Brian Eno",
    avatar: {
      src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Smiling man in a floral shirt",
    },
    body: "Caching here cuts the cold build in half. Lovely.",
  },
  approveLabel: "Approve",
  approvedLabel: "Approved",
  framed: true,
  stepMs: 1000,
};

const NEXT: Record<Phase, Phase> = {
  approved: "clear",
  clear: "focus",
  focus: "comment",
  comment: "approach",
  approach: "press",
  press: "result",
  result: "approved",
};

/* How long each phase lasts, in steps. The cursor glides back to rest while approved holds. */
const HOLD: Record<Phase, number> = {
  approved: 3,
  clear: 1,
  focus: 0.9,
  comment: 1.6,
  approach: 1.2,
  press: 0.4,
  result: 1,
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

const lineClasses: Record<LineKind, string> = {
  context: "",
  removed: "bg-rose-500/10",
  added: "bg-emerald-500/10",
};

const signClasses: Record<LineKind, string> = {
  context: "text-muted-foreground",
  removed: "text-rose-500",
  added: "text-emerald-600 dark:text-emerald-400",
};

const SIGN: Record<LineKind, string> = {
  context: " ",
  removed: "-",
  added: "+",
};

const fade = "transition-all duration-500 ease-out motion-reduce:transition-none";

export function Code19({
  fileName,
  lines = [],
  commentLine = 0,
  comment,
  approveLabel,
  approvedLabel,
  framed = true,
  cursorLabel,
  stepMs = 1000,
  className,
}: Code19Props) {
  const [phase, setPhase] = useState<Phase>("approved");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const focused = phase !== "clear";
  const showComment = phase !== "clear" && phase !== "focus";
  const approved = phase === "result" || phase === "approved";
  const onTarget = phase === "approach" || phase === "press" || phase === "result";
  const pressing = phase === "press";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className={cn(
          "w-xl shrink-0",
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
          <div className="flex items-center justify-between gap-4">
            {fileName && <p className="truncate text-lg font-normal tracking-tight">{fileName}</p>}
            {(approveLabel || approvedLabel) && (
              <div className="relative grid shrink-0 items-center justify-items-end">
                {approveLabel && (
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden={approved}
                    className={cn(
                      "inline-flex h-8 cursor-pointer items-center rounded-md bg-primary px-3 text-sm text-primary-foreground shadow-xs transition-all duration-300 ease-out hover:bg-primary/90 motion-reduce:transition-none [grid-area:1/1]",
                      approved ? "pointer-events-none scale-95 opacity-0" : "scale-100 opacity-100",
                      pressing && "scale-95 bg-primary/85"
                    )}
                  >
                    {approveLabel}
                  </button>
                )}
                {approvedLabel && (
                  <span
                    aria-hidden={!approved}
                    className={cn(
                      "inline-flex h-7 items-center gap-1.5 rounded-full border border-emerald-500/40 px-3 text-sm text-emerald-700 dark:text-emerald-400 [grid-area:1/1]",
                      fade,
                      approved ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    )}
                  >
                    <Check className="size-3.5" aria-hidden="true" />
                    {approvedLabel}
                  </span>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                  style={{ transform: onTarget ? "translate(0.5rem, 0.25rem)" : "translate(0, 3.25rem)" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    className={cn(
                      "size-7 fill-foreground stroke-background transition-transform duration-150",
                      pressing && "scale-90"
                    )}
                  >
                    <path d="M4 2.5 20 11l-7.2 1.6L9.6 19.5z" strokeLinejoin="round" />
                  </svg>
                  {cursorLabel && (
                    <span className="absolute left-4 top-6 rounded-full bg-foreground px-4 py-1.5 text-base text-background ring-2 ring-background">
                      {cursorLabel}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 overflow-hidden rounded-md border border-border font-mono text-sm leading-7">
            {lines.map((line, index) => {
              const target = index === commentLine;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex whitespace-pre transition-shadow duration-500 motion-reduce:transition-none",
                    lineClasses[line.kind],
                    target && focused ? "ring-1 ring-inset ring-primary/50" : "ring-0"
                  )}
                >
                  <span className={cn("w-8 shrink-0 select-none text-center", signClasses[line.kind])} aria-hidden="true">
                    {SIGN[line.kind]}
                  </span>
                  <span className="min-w-0 pr-3">{line.text}</span>
                </div>
              );
            })}
          </div>

          {comment && (
            <div
              className={cn(
                "mt-4 flex items-start gap-3",
                fade,
                showComment ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
              )}
            >
              <img
                src={comment.avatar.src}
                alt={comment.avatar.alt}
                className="size-9 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{comment.author}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{comment.body}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
