"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Progress21Props {
  person?: { name: string; role: string; avatar: { src: string; alt: string } };
  /** Each account opens in turn and closes one more part of the ring. */
  accounts?: string[];
  /** Status on the right of each account row: open, opening now, still waiting. */
  readyLabel?: string;
  openingLabel?: string;
  queuedLabel?: string;
  progressLabel?: string;
  doneLabel?: string;
  /** Fixed card height in px, so cards set side by side match; content sits inside it. */
  height?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const progress21Demo: Progress21Props = {
  person: {
    name: "Norah Jones",
    role: "Product designer, starts Monday",
    avatar: {
      src: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Laughing woman in a white top",
    },
  },
  accounts: ["Email", "Calendar", "Design files", "Team chat", "Payroll", "Laptop"],
  readyLabel: "Ready",
  openingLabel: "Opening",
  queuedLabel: "Queued",
  progressLabel: "Setting up accounts",
  doneLabel: "Ready for day one",
  framed: true,
  stepMs: 700,
};

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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

/* Step 0 resets, steps 1 to n open one account each, and the last step holds the finished ring. */
export function Progress21({
  person,
  accounts = [],
  readyLabel,
  openingLabel,
  queuedLabel,
  progressLabel,
  doneLabel,
  framed = true,
  stepMs = 700,
  className,
  height,
}: Progress21Props) {
  const total = accounts.length;
  const [step, setStep] = useState(total);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const delay = step >= total ? stepMs * 7 : step === 0 ? stepMs * 1.6 : stepMs;
    const id = setTimeout(() => setStep(step >= total ? 0 : step + 1), delay);
    return () => clearTimeout(id);
  }, [step, total, stepMs]);

  const open = Math.min(step, total);
  const done = total > 0 && open === total;
  const share = total > 0 ? open / total : 0;

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
          className={cn("rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs", height && "flex flex-col justify-between")}
          style={height ? { height } : undefined}
        >
          <div className="flex items-center gap-5">
            <div className="relative size-24 shrink-0">
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="3" className="stroke-muted" />
                <circle
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={cn(
                    "transition-[stroke-dashoffset,stroke] duration-700 ease-out motion-reduce:transition-none",
                    done ? "stroke-emerald-500" : "stroke-primary"
                  )}
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - share)}
                />
              </svg>
              {person && (
                <img
                  src={person.avatar.src}
                  alt={person.avatar.alt}
                  className="absolute inset-3 size-18 rounded-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              {person && (
                <>
                  <p className="truncate text-lg tracking-tight">{person.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{person.role}</p>
                </>
              )}
            </div>
          </div>

          <ul className="mt-5 border-t border-border pt-3">
            {accounts.map((account, index) => {
              const ready = index < open;
              const opening = index === open && step > 0;
              const status = ready ? readyLabel : opening ? openingLabel : queuedLabel;
              return (
                <li key={index} className="flex h-8 min-w-0 items-center gap-2.5">
                  <span className="relative grid size-4 shrink-0 place-items-center" aria-hidden="true">
                    <span
                      className={cn(
                        "col-start-1 row-start-1 size-4 rounded-full border border-border transition-opacity duration-300",
                        ready ? "opacity-0" : "opacity-100"
                      )}
                    />
                    <span
                      className={cn(
                        "col-start-1 row-start-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white transition-all duration-300 ease-out motion-reduce:transition-none",
                        ready ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      )}
                    >
                      <Check className="size-2.5" />
                    </span>
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-sm transition-colors duration-300",
                      ready ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {account}
                  </span>
                  {status && (
                    <span
                      className={cn(
                        "shrink-0 text-sm transition-colors duration-300",
                        opening ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {status}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="relative mt-3 grid border-t border-border pt-4 text-sm">
            <span
              className={cn(
                "col-start-1 row-start-1 text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                done ? "opacity-0" : "opacity-100"
              )}
            >
              {progressLabel}
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 text-emerald-700 transition-opacity duration-500 dark:text-emerald-400 motion-reduce:transition-none",
                done ? "opacity-100" : "opacity-0"
              )}
            >
              {doneLabel}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
