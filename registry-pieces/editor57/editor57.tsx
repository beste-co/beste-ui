"use client";

import { Sparkle } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "fade" | "pause" | "write";

interface Editor57Props {
  brief?: string;
  draft?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  /** Delay between words while the draft writes itself. */
  wordMs?: number;
  className?: string;
}

export const editor57Demo: Editor57Props = {
  brief: "Announce the spring collection to returning customers, warm and short.",
  draft:
    "Spring is here, and so is the collection you helped shape. Linen shirts in four new colors, a lighter weave for warm evenings and the canvas tote you asked for all winter. As a returning customer, you get first pick until Friday.",
  framed: true,
  stepMs: 900,
  wordMs: 110,
};

const NEXT: Record<Phase, Phase> = {
  rest: "fade",
  fade: "pause",
  pause: "write",
  write: "rest",
};

/* How long each phase lasts, in steps. The write phase is paced by words instead. */
const HOLD: Record<Phase, number> = {
  rest: 4,
  fade: 0.8,
  pause: 0.8,
  write: 0,
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

export function Editor57({ brief, draft, framed = true, stepMs = 900, wordMs = 110, className }: Editor57Props) {
  const words = useMemo(() => (draft ?? "").split(/\s+/).filter(Boolean), [draft]);
  const [phase, setPhase] = useState<Phase>("rest");
  const [count, setCount] = useState(words.length);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    if (phase === "write") {
      const done = count >= words.length;
      const id = setTimeout(() => (done ? setPhase(NEXT.write) : setCount((c) => c + 1)), done ? stepMs : wordMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      if (phase === "fade") setCount(0);
      setPhase(NEXT[phase]);
    }, HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, count, words.length, stepMs, wordMs]);

  const writing = phase === "pause" || phase === "write";

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
          {brief && (
            <p className="flex items-center gap-3 rounded-md border border-border px-3.5 py-3 text-sm">
              <Sparkle className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{brief}</span>
            </p>
          )}
          {words.length > 0 && (
            <div className="mt-5 grid text-base leading-relaxed">
              {/* Invisible full copy holds the final height so the card never grows while writing. */}
              <p className="invisible col-start-1 row-start-1">{draft}</p>
              <p
                className={cn(
                  "col-start-1 row-start-1 transition-opacity duration-500 ease-out motion-reduce:transition-none",
                  phase === "fade" && "opacity-0"
                )}
              >
                {words.slice(0, count).join(" ")}
                {writing && (
                  <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-5 w-px translate-y-1 animate-pulse bg-primary"
                  />
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
