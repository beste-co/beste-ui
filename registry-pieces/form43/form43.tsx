"use client";

import { Check, FileText } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "type" | "approach" | "press" | "welcome";

interface Field {
  label: string;
  value: string;
}

interface Form43Props {
  title?: string;
  description?: string;
  fields?: Field[];
  submitLabel?: string;
  /** The state the card turns into once the account is created. */
  welcome?: { heading: string; body: string; document: string; documentMeta: string };
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const form43Demo: Form43Props = {
  title: "Create your account",
  description: "Your first manuscript is free to keep.",
  fields: [
    { label: "Name", value: "Nick Drake" },
    { label: "Email", value: "hello@beste.co" },
  ],
  submitLabel: "Create account",
  welcome: {
    heading: "Welcome, Nick",
    body: "Your workspace is ready and the first page is open.",
    document: "Untitled manuscript",
    documentMeta: "Saved just now",
  },
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "type",
  type: "approach",
  approach: "press",
  press: "welcome",
  welcome: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 0.9, type: 2.2, approach: 1.2, press: 0.4, welcome: 0.8 };

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

export function Form43({
  title,
  description,
  fields = [],
  submitLabel,
  welcome,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Form43Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const totalChars = fields.reduce((sum, field) => sum + field.value.length, 0);
  const [typed, setTyped] = useState(totalChars);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  /* Both fields fill in one after the other at an even typing pace. */
  useEffect(() => {
    if (phase === "reset") {
      setTyped(0);
      return;
    }
    if (phase !== "type") {
      setTyped(totalChars);
      return;
    }
    const duration = HOLD.type * stepMs * 0.9;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setTyped(Math.round(totalChars * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, totalChars, stepMs]);

  const welcomed = phase === "welcome" || phase === "rest";
  const onButton = phase === "approach" || phase === "press";
  let offset = 0;

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes form43-caret { 50% { opacity: 0; } }
.form43-caret { animation: form43-caret 900ms steps(1) infinite; }
@media (prefers-reduced-motion: reduce) { .form43-caret { animation: none; } }
`}</style>
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
        {/* Form and welcome share one grid cell, so the card keeps its size as it turns over. */}
        <div className="grid rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs">
          <div
            aria-hidden={welcomed}
            className={cn(
              "col-start-1 row-start-1 transition-all duration-500 ease-out motion-reduce:transition-none",
              welcomed ? "pointer-events-none scale-95 opacity-0 blur-sm" : "scale-100 opacity-100 blur-0"
            )}
          >
            <p className="text-lg tracking-tight">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>

            <div className="mt-5 flex flex-col gap-4">
              {fields.map((field, index) => {
                const start = offset;
                offset += field.value.length;
                const count = Math.min(Math.max(typed - start, 0), field.value.length);
                const typing = phase === "type" && typed >= start && typed < start + field.value.length;
                return (
                  <div key={index}>
                    <p className="mb-1.5 text-sm text-muted-foreground">{field.label}</p>
                    <div
                      className={cn(
                        "flex h-10 items-center rounded-md border px-3 text-base transition-colors duration-300",
                        typing ? "border-primary" : "border-input"
                      )}
                    >
                      <span className="truncate">{field.value.slice(0, count)}</span>
                      {typing && <span aria-hidden="true" className="form43-caret ml-px h-5 w-px bg-foreground" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative mt-6">
              <span
                className={cn(
                  "grid h-10 w-full place-items-center rounded-md bg-primary text-sm text-primary-foreground transition-all duration-150",
                  phase === "press" && "scale-95 bg-primary/85"
                )}
              >
                {submitLabel}
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: onButton ? "translate(0.5rem, 0.25rem)" : "translate(6rem, 4rem)" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className={cn(
                    "size-7 fill-foreground stroke-background transition-transform duration-150",
                    phase === "press" && "scale-90"
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
          </div>

          {welcome && (
            <div
              aria-hidden={!welcomed}
              className={cn(
                "col-start-1 row-start-1 flex flex-col items-center justify-center text-center transition-all delay-150 duration-700 ease-out motion-reduce:transition-none",
                welcomed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
              )}
            >
              <span
                className="flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white"
                aria-hidden="true"
              >
                <Check className="size-5" />
              </span>
              <p className="mt-5 text-2xl tracking-tight">{welcome.heading}</p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">{welcome.body}</p>
              <div className="mt-6 flex w-full items-center gap-3 rounded-md border border-border px-3 py-3 text-left">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted" aria-hidden="true">
                  <FileText className="size-4 text-muted-foreground" />
                </span>
                <span className="min-w-0 flex-1 truncate text-base">{welcome.document}</span>
                <span className="shrink-0 text-sm text-muted-foreground">{welcome.documentMeta}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
