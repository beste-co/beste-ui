"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Ai53Props {
  name?: string;
  role?: string;
  avatar?: { src: string; alt: string };
  /** A passage from the application, shown as written. */
  excerpt?: string;
  /** Phrases of the excerpt that matter for the role, marked one by one in reading order. */
  highlights?: string[];
  /** Quiet line at the foot of the card. */
  note?: string;
  /** Fixed card height in px, so cards set side by side match; content sits inside it. */
  height?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const ai53Demo: Ai53Props = {
  name: "Joni Mitchell",
  role: "Applied for Product designer",
  avatar: {
    src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
    alt: "Woman with long dark hair holding a coffee cup",
  },
  excerpt:
    "For the last four years I have worked at a small fintech studio, where I led a design system used by 40 teams. Before that I shipped 2 mobile apps from zero, and today I mentor 3 junior designers.",
  highlights: ["led a design system used by 40 teams", "shipped 2 mobile apps from zero", "mentor 3 junior designers"],
  note: "Read in full, 3 points for the role",
  framed: true,
  stepMs: 900,
};

const MARK = "color-mix(in oklab, var(--primary) 18%, transparent)";

/* Splits the excerpt into plain runs and marked runs, finding each highlight after the previous one. */
function segment(text: string, highlights: string[]) {
  const parts: { text: string; mark: number | null }[] = [];
  let from = 0;
  highlights.forEach((phrase, index) => {
    const at = text.indexOf(phrase, from);
    if (at < 0) return;
    if (at > from) parts.push({ text: text.slice(from, at), mark: null });
    parts.push({ text: phrase, mark: index });
    from = at + phrase.length;
  });
  if (from < text.length) parts.push({ text: text.slice(from), mark: null });
  return parts;
}

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

export function Ai53({
  name,
  role,
  avatar,
  excerpt = "",
  highlights = [],
  note,
  height,
  framed = true,
  stepMs = 900,
  className,
}: Ai53Props) {
  /* Step 0 clears the marks, each next step marks one phrase, the last holds the finished card. */
  const last = highlights.length;
  const [step, setStep] = useState(last);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    if (entrance.still) return;
    const delay = step === last ? stepMs * 5 : step === 0 ? stepMs : stepMs * 1.2;
    const id = setTimeout(() => setStep(step >= last ? 0 : step + 1), delay);
    return () => clearTimeout(id);
  }, [step, last, stepMs, entrance.still]);

  const parts = segment(excerpt, highlights);

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
        <div
          className="flex flex-col rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs"
          style={height ? { height } : undefined}
        >
          <div className="flex items-center gap-3">
            {avatar && <img src={avatar.src} alt={avatar.alt} className="size-10 shrink-0 rounded-md object-cover" />}
            <div className="min-w-0">
              <p className="truncate text-base">{name}</p>
              <p className="truncate text-sm text-muted-foreground">{role}</p>
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {parts.map((part, index) => {
              if (part.mark === null) return <span key={index}>{part.text}</span>;
              const on = part.mark < step;
              return (
                <mark
                  key={index}
                  className={cn(
                    "rounded-sm bg-transparent bg-no-repeat [box-decoration-break:clone] transition-[background-size,color] duration-700 ease-out motion-reduce:transition-none",
                    on ? "text-foreground" : "text-muted-foreground"
                  )}
                  style={{
                    backgroundImage: `linear-gradient(${MARK}, ${MARK})`,
                    backgroundSize: on ? "100% 100%" : "0% 100%",
                  }}
                >
                  {part.text}
                </mark>
              );
            })}
          </p>

          {note && (
            <p
              className={cn(
                "mt-auto pt-5 text-sm text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                step === last ? "opacity-100" : "opacity-0"
              )}
            >
              {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
