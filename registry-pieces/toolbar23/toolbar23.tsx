"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "approach" | "press" | "publishing";

interface TeamMember {
  name: string;
  avatar: { src: string; alt: string };
}

interface Toolbar23Props {
  title?: string;
  version?: string;
  team?: TeamMember[];
  draftLabel?: string;
  publishingLabel?: string;
  liveLabel?: string;
  publishLabel?: string;
  publishedLabel?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const toolbar23Demo: Toolbar23Props = {
  title: "Halcyon checkout",
  version: "Version 14, edited today",
  team: [
    {
      name: "Brian Eno",
      avatar: {
        src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Smiling man in a floral shirt",
      },
    },
    {
      name: "Joni Mitchell",
      avatar: {
        src: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Laughing woman in a white top",
      },
    },
  ],
  draftLabel: "3 changes ready",
  publishingLabel: "Publishing",
  liveLabel: "Live for 12,000 customers",
  publishLabel: "Publish",
  publishedLabel: "Published",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "approach",
  approach: "press",
  press: "publishing",
  publishing: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1.6, approach: 1.2, press: 0.4, publishing: 1.6 };

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

export function Toolbar23({
  title,
  version,
  team = [],
  draftLabel,
  publishingLabel,
  liveLabel,
  publishLabel,
  publishedLabel,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Toolbar23Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const live = phase === "rest";
  const publishing = phase === "publishing";
  const draft = !live && !publishing;
  const onButton = phase === "approach" || phase === "press";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className={cn(
          "w-lg shrink-0",
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
          <p className="text-lg tracking-tight">{title}</p>
          <p className="text-sm text-muted-foreground">{version}</p>

          {/* A quiet sketch of the page being shipped; the bar along its top fills while it publishes. */}
          <div className="relative mt-4 h-44 overflow-hidden rounded-md border border-border bg-muted" aria-hidden="true">
            <span
              className="absolute inset-x-0 top-0 h-0.5 origin-left bg-primary"
              style={{
                transform: `scaleX(${publishing ? 1 : 0})`,
                opacity: publishing ? 1 : 0,
                transition: entrance.still
                  ? "none"
                  : publishing
                  ? `transform ${HOLD.publishing * stepMs}ms ease-out, opacity 200ms`
                  : "transform 0ms, opacity 400ms",
              }}
            />
            <div className="flex h-full gap-4 p-5 pb-10">
              <div className="flex flex-1 flex-col gap-3">
                <span className="h-2.5 w-2/3 rounded-full bg-foreground/15" />
                <span className="h-2 w-1/2 rounded-full bg-foreground/10" />
                <span className="mt-2 h-9 rounded-md border border-border bg-card" />
                <span className="h-9 rounded-md border border-border bg-card" />
              </div>
              <div className="flex w-36 flex-col gap-3 rounded-md bg-card p-3">
                <span className="h-2 w-3/4 rounded-full bg-foreground/10" />
                <span className="h-2 w-1/2 rounded-full bg-foreground/10" />
                <span className="mt-auto h-7 rounded-md bg-primary" />
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto -mt-6 flex w-fit items-center gap-3 rounded-lg border border-border bg-card py-1.5 pr-1.5 pl-2 shadow-lg shadow-foreground/5">
            {team.length > 0 && (
              <>
                <span className="flex -space-x-2">
                  {team.map((member, index) => (
                    <img
                      key={index}
                      src={member.avatar.src}
                      alt={member.avatar.alt}
                      title={member.name}
                      className="size-7 rounded-md object-cover ring-2 ring-card"
                    />
                  ))}
                </span>
                <span className="h-5 w-px bg-border" aria-hidden="true" />
              </>
            )}

            <span className="relative grid w-52">
              <span
                className={cn(
                  "col-start-1 row-start-1 truncate text-sm text-muted-foreground transition-opacity duration-300",
                  draft ? "opacity-100" : "opacity-0"
                )}
              >
                {draftLabel}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 truncate text-sm text-muted-foreground transition-opacity duration-300",
                  publishing ? "opacity-100" : "opacity-0"
                )}
              >
                {publishingLabel}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 flex items-center gap-2 text-sm text-foreground transition-all duration-500 ease-out motion-reduce:transition-none",
                  live ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                )}
              >
                <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="truncate">{liveLabel}</span>
              </span>
            </span>

            <div className="relative shrink-0">
              <span className="grid">
                <span
                  className={cn(
                    "col-start-1 row-start-1 inline-flex h-8 items-center justify-center rounded-md bg-primary px-3.5 text-sm text-primary-foreground transition-all duration-300",
                    draft ? "opacity-100" : publishing ? "opacity-40" : "opacity-0",
                    phase === "press" && "scale-95 bg-primary/85"
                  )}
                >
                  {publishLabel}
                </span>
                <span
                  className={cn(
                    "col-start-1 row-start-1 inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-muted px-3.5 text-sm text-muted-foreground transition-all duration-500 ease-out motion-reduce:transition-none",
                    live ? "scale-100 opacity-100" : "scale-90 opacity-0"
                  )}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  {publishedLabel}
                </span>
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: onButton ? "translate(0.5rem, 0.25rem)" : "translate(-8rem, -7rem)" }}
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
        </div>
      </div>
    </div>
  );
}
