"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "building" | "ready" | "approach" | "press" | "open";

interface Browser39Props {
  author?: { name: string; avatar: { src: string; alt: string } };
  title?: string;
  branch?: string;
  buildingLabel?: string;
  readyLabel?: string;
  duration?: string;
  visitLabel?: string;
  url?: string;
  /** The page the preview shows once it opens. */
  page?: { heading: string; body: string; action: string };
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const browser39Demo: Browser39Props = {
  author: {
    name: "Brian Eno",
    avatar: {
      src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Smiling man in a floral shirt",
    },
  },
  title: "Calmer onboarding steps",
  branch: "feat/onboarding",
  buildingLabel: "Building preview",
  readyLabel: "Preview ready",
  duration: "38s",
  visitLabel: "Visit",
  url: "onboarding.preview.acme.dev",
  page: { heading: "Welcome aboard", body: "Three short steps and your workspace is ready.", action: "Continue" },
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "building",
  building: "ready",
  ready: "approach",
  approach: "press",
  press: "open",
  open: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4, reset: 1, building: 2.2, ready: 0.8, approach: 1.2, press: 0.4, open: 1 };

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

export function Browser39({
  author,
  title,
  branch,
  buildingLabel,
  readyLabel,
  duration,
  visitLabel,
  url,
  page,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Browser39Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const building = phase === "reset" || phase === "building";
  const open = phase === "open" || phase === "rest";
  const onButton = phase === "approach" || phase === "press";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes browser39-spin { to { transform: rotate(360deg); } }
.browser39-spin { animation: browser39-spin 900ms linear infinite; }
@media (prefers-reduced-motion: reduce) { .browser39-spin { animation: none; } }
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
        <div className="rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs">
          <div className="flex items-center gap-3">
            {author && (
              <img src={author.avatar.src} alt={author.avatar.alt} className="size-10 shrink-0 rounded-md object-cover" />
            )}
            <div className="min-w-0">
              <p className="truncate text-lg tracking-tight">{title}</p>
              <p className="truncate text-sm text-muted-foreground">{branch}</p>
            </div>
          </div>

          <div className="mt-5 flex h-10 items-center gap-3 border-t border-border pt-5">
            <span className="relative grid size-4 shrink-0 place-items-center" aria-hidden="true">
              <span
                className={cn(
                  "browser39-spin col-start-1 row-start-1 size-4 rounded-full border-2 border-muted border-t-primary transition-opacity duration-300",
                  building ? "opacity-100" : "opacity-0"
                )}
              />
              <span
                className={cn(
                  "col-start-1 row-start-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white transition-all duration-300",
                  building ? "scale-50 opacity-0" : "scale-100 opacity-100"
                )}
              >
                <Check className="size-2.5" />
              </span>
            </span>
            <span className="relative grid flex-1">
              <span className={cn("col-start-1 row-start-1 text-base transition-opacity duration-300", building ? "opacity-100" : "opacity-0")}>
                {buildingLabel}
              </span>
              <span className={cn("col-start-1 row-start-1 text-base transition-opacity duration-300", building ? "opacity-0" : "opacity-100")}>
                {readyLabel}
                <span className="ml-2 text-sm tabular-nums text-muted-foreground">{duration}</span>
              </span>
            </span>
            <div className="relative shrink-0">
              <span
                className={cn(
                  "inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm text-primary-foreground transition-all duration-300",
                  building ? "opacity-40" : "opacity-100",
                  phase === "press" && "scale-95 bg-primary/85"
                )}
              >
                {visitLabel}
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: onButton ? "translate(0.5rem, 0.25rem)" : "translate(-2.5rem, 3.25rem)" }}
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

          {/* The preview opens below the build row once Visit is pressed. */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-700 ease-out motion-reduce:transition-none",
              open ? "mt-5 max-h-64 opacity-100" : "mt-0 max-h-0 opacity-0"
            )}
          >
            <div className="overflow-hidden rounded-md border border-border">
              <div className="flex items-center gap-3 border-b border-border bg-muted px-3 py-2">
                <span className="flex gap-1" aria-hidden="true">
                  <span className="size-2 rounded-full bg-foreground/15" />
                  <span className="size-2 rounded-full bg-foreground/15" />
                  <span className="size-2 rounded-full bg-foreground/15" />
                </span>
                <span className="flex-1 truncate rounded-md bg-card px-3 py-0.5 text-center text-sm text-muted-foreground">
                  {url}
                </span>
              </div>
              {page && (
                <div
                  className={cn(
                    "px-5 py-6 transition-all delay-200 duration-700 ease-out motion-reduce:transition-none",
                    open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  )}
                >
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="h-1 w-8 rounded-full bg-primary" />
                    <span className="h-1 w-8 rounded-full bg-muted" />
                    <span className="h-1 w-8 rounded-full bg-muted" />
                  </div>
                  <p className="mt-4 text-xl tracking-tight">{page.heading}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{page.body}</p>
                  <span className="mt-4 inline-flex h-8 items-center rounded-md bg-foreground px-3 text-sm text-background">
                    {page.action}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
