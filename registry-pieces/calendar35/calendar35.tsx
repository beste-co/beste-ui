"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "approach" | "press" | "result";

interface ScheduledPost {
  day: string;
  title: string;
  channel: string;
}

interface Calendar35Props {
  readyLabel?: string;
  /** The approved post waiting for a slot. It lands in the list after the click. */
  pending?: ScheduledPost;
  scheduleLabel?: string;
  scheduledLabel?: string;
  title?: string;
  /** Posts already on the week, in order. */
  posts?: ScheduledPost[];
  /** Where the pending post lands in the list. */
  insertAt?: number;
  cursorLabel?: string;
  /** Frosted rim around the cards, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const calendar35Demo: Calendar35Props = {
  readyLabel: "Ready to schedule",
  pending: { day: "Wed", title: "Four new colors, first look", channel: "Reel" },
  scheduleLabel: "Schedule",
  scheduledLabel: "Scheduled",
  title: "This week",
  posts: [
    { day: "Mon", title: "Spring collection is here", channel: "Email" },
    { day: "Thu", title: "Behind the linen weave", channel: "Blog" },
    { day: "Fri", title: "Weekend styling ideas", channel: "Social" },
  ],
  insertAt: 1,
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "approach", approach: "press", press: "result", result: "rest" };
const HOLD: Record<Phase, number> = { rest: 4, reset: 1.4, approach: 1.2, press: 0.4, result: 0.8 };

/* The cards are drawn at a fixed width and scaled down to fit small slots, so their proportions never change. */
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

function PostRow({ post, fresh }: { post: ScheduledPost; fresh?: boolean }) {
  return (
    <div className="flex h-12 items-center gap-4 border-t border-border text-base">
      <span
        className={cn(
          "w-10 shrink-0 text-sm transition-colors duration-700",
          fresh ? "text-primary" : "text-muted-foreground"
        )}
      >
        {post.day}
      </span>
      <span className="min-w-0 flex-1 truncate">{post.title}</span>
      <span className="shrink-0 text-sm text-muted-foreground">{post.channel}</span>
    </div>
  );
}

export function Calendar35({
  readyLabel,
  pending,
  scheduleLabel,
  scheduledLabel,
  title,
  posts = [],
  insertAt = 0,
  cursorLabel,
  framed = true,
  stepMs = 900,
  className,
}: Calendar35Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const placed = phase === "result" || phase === "rest";
  const onButton = phase === "approach" || phase === "press";
  const frame = framed && "rounded-2xl border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md";
  const before = posts.slice(0, insertAt);
  const after = posts.slice(insertAt);

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className="flex w-md shrink-0 flex-col gap-4"
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
        {pending && (
          <div className={cn(frame)}>
            <div className="rounded-lg bg-card px-5 py-4 text-card-foreground shadow-xs">
              <p className="text-sm text-muted-foreground">{readyLabel}</p>
              <div className="mt-2 flex items-center gap-4">
                <p className="min-w-0 flex-1 truncate text-lg tracking-tight">{pending.title}</p>
                <div className="relative grid shrink-0">
                  <span
                    className={cn(
                      "col-start-1 row-start-1 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm text-primary-foreground transition-all duration-300",
                      phase === "press" && "scale-95 bg-primary/85",
                      placed ? "scale-95 opacity-0" : "opacity-100"
                    )}
                  >
                    {scheduleLabel}
                  </span>
                  <span
                    className={cn(
                      "col-start-1 row-start-1 inline-flex h-9 items-center justify-center gap-1.5 text-sm text-muted-foreground transition-opacity duration-300",
                      placed ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <Check className="size-4 text-primary" aria-hidden="true" />
                    {scheduledLabel}
                  </span>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                    style={{ transform: onButton ? "translate(0.5rem, 0.25rem)" : "translate(-0.5rem, 3.25rem)" }}
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
        )}

        <div className={cn(frame)}>
          <div className="rounded-lg bg-card px-5 pb-1 pt-4 text-card-foreground shadow-xs">
            {title && <p className="pb-3 text-lg tracking-tight">{title}</p>}
            {before.map((post, index) => (
              <PostRow key={`b${index}`} post={post} />
            ))}
            {pending && (
              <div
                className={cn(
                  "overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none",
                  placed ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <PostRow post={pending} fresh={phase === "result"} />
              </div>
            )}
            {after.map((post, index) => (
              <PostRow key={`a${index}`} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
