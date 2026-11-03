"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "done" | "reset" | "first" | "second" | "third" | "approach" | "press" | "paid";

interface Approver {
  name: string;
  role: string;
  avatar: { src: string; alt: string };
  /** Shown once this person's step is finished, e.g. "Approved" or "Paid out". */
  doneLabel: string;
}

interface Automation22Props {
  title?: string;
  amount?: string;
  approvers?: Approver[];
  activeLabel?: string;
  /** Button on the final step that the cursor presses. */
  approveLabel?: string;
  /** Name on the cursor, usually the final approver's first name. */
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const automation22Demo: Automation22Props = {
  title: "Team offsite travel",
  amount: "$1,240.00",
  approvers: [
    {
      name: "Leonard Cohen",
      role: "Team lead",
      avatar: {
        src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Smiling man in a floral shirt",
      },
      doneLabel: "Approved",
    },
    {
      name: "Joni Mitchell",
      role: "Budget owner",
      avatar: {
        src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Woman holding a coffee cup",
      },
      doneLabel: "Approved",
    },
    {
      name: "Aretha Franklin",
      role: "Finance",
      avatar: {
        src: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Laughing woman in a white top",
      },
      doneLabel: "Paid out",
    },
  ],
  activeLabel: "Reviewing",
  approveLabel: "Approve",
  cursorLabel: "Aretha",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = {
  done: "reset",
  reset: "first",
  first: "second",
  second: "third",
  third: "approach",
  approach: "press",
  press: "paid",
  paid: "done",
};

/* How long each phase lasts, in steps. */
const HOLD: Record<Phase, number> = {
  done: 2.5,
  reset: 1,
  first: 1.6,
  second: 1.6,
  third: 1.2,
  approach: 1.2,
  press: 0.4,
  paid: 1.2,
};

/* Which step is in review during each phase; -1 means none. */
const ACTIVE: Record<Phase, number> = {
  done: -1,
  reset: -1,
  first: 0,
  second: 1,
  third: 2,
  approach: 2,
  press: 2,
  paid: -1,
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

/* Parked just below the Approve button; glides onto it, presses, and glides back once the payout settles. */
function Cursor({ label, onTarget, pressing }: { label?: string; onTarget: boolean; pressing: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
      style={{ transform: onTarget ? "translate(0.5rem, 0.25rem)" : "translate(-2rem, 1.5rem)" }}
    >
      <svg
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        className={cn("size-7 fill-foreground stroke-background transition-transform duration-150", pressing && "scale-90")}
      >
        <path d="M4 2.5 20 11l-7.2 1.6L9.6 19.5z" strokeLinejoin="round" />
      </svg>
      {label && (
        <span className="absolute left-4 top-6 rounded-full bg-foreground px-4 py-1.5 text-base text-background ring-2 ring-background">
          {label}
        </span>
      )}
    </div>
  );
}

export function Automation22({
  title,
  amount,
  approvers = [],
  activeLabel,
  approveLabel = "Approve",
  cursorLabel,
  framed = true,
  stepMs = 900,
  className,
}: Automation22Props) {
  const [phase, setPhase] = useState<Phase>("done");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const active = ACTIVE[phase];
  const doneCount = phase === "done" || phase === "paid" ? approvers.length : phase === "reset" ? 0 : active;
  const pressing = phase === "press";
  const onTarget = phase === "approach" || phase === "press" || phase === "paid";
  const lastIndex = approvers.length - 1;
  const progress = approvers.length > 0 ? (doneCount / approvers.length) * 100 : 0;

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
        <div className="rounded-lg bg-card px-5 pb-2 pt-5 text-card-foreground shadow-xs">
          {(title || amount) && (
            <div className="flex items-baseline justify-between gap-4">
              <p className="min-w-0 truncate text-lg font-normal tracking-tight">{title}</p>
              <p className="shrink-0 text-lg font-normal tabular-nums">{amount}</p>
            </div>
          )}
          <div aria-hidden="true" className="mt-4 h-0.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ul className="mt-1 divide-y divide-border">
            {approvers.map((person, index) => {
              const isDone = index < doneCount;
              const isActive = index === active;
              const isLast = index === lastIndex;
              /* The final step waits on a click instead of a review pulse. */
              const showApprove = isLast && isActive;
              return (
                <li key={index} className="flex items-center gap-3 py-4">
                  <img
                    src={person.avatar.src}
                    alt={person.avatar.alt}
                    className={cn(
                      "size-10 shrink-0 rounded-md object-cover transition-opacity duration-500 motion-reduce:transition-none",
                      isDone || isActive ? "opacity-100" : "opacity-50"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base">{person.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{person.role}</p>
                  </div>
                  {/* Both states share one grid cell so the label swap never shifts the row. */}
                  <div className="grid w-28 shrink-0 justify-items-end text-sm">
                    <span
                      className={cn(
                        "col-start-1 row-start-1 flex items-center gap-2 text-muted-foreground transition-all duration-500 ease-out motion-reduce:transition-none",
                        isActive && !showApprove ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                      )}
                    >
                      <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-primary" />
                      {activeLabel}
                    </span>
                    <span
                      className={cn(
                        "col-start-1 row-start-1 flex items-center gap-2 text-emerald-600 transition-all duration-500 ease-out motion-reduce:transition-none dark:text-emerald-400",
                        isDone ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                      )}
                    >
                      <Check className="size-4" aria-hidden="true" />
                      {person.doneLabel}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "col-start-1 row-start-1 size-4 self-center rounded-full border border-dashed border-border transition-opacity duration-500 motion-reduce:transition-none",
                        isDone || isActive ? "opacity-0" : "opacity-100"
                      )}
                    />
                    {isLast && (
                      <span className="relative col-start-1 row-start-1 flex self-center">
                        <span
                          className={cn(
                            "inline-flex h-8 items-center rounded-md border border-border bg-card px-3 text-sm shadow-xs transition-all duration-300 ease-out motion-reduce:transition-none",
                            showApprove ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0",
                            pressing && "scale-95 bg-muted"
                          )}
                        >
                          {approveLabel}
                        </span>
                        <Cursor label={cursorLabel} onTarget={onTarget} pressing={pressing} />
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
