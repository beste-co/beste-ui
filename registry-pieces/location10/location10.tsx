"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "wake";

interface TeamMember {
  name: string;
  city: string;
  /** Local time shown once the member is online. */
  time: string;
  avatar: { src: string; alt: string };
}

interface Location10Props {
  title?: string;
  /** Use {count}, as in "{count} online". */
  onlineTemplate?: string;
  members?: TeamMember[];
  /** Index of the member who starts their day in the loop. */
  wakeIndex?: number;
  /** Local time of that member just before they come online. */
  beforeTime?: string;
  asleepLabel?: string;
  awakeLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const location10Demo: Location10Props = {
  title: "The team right now",
  onlineTemplate: "{count} online",
  members: [
    {
      name: "Thom Yorke",
      city: "Lisbon",
      time: "6:00 PM",
      avatar: {
        src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Smiling man in a floral shirt",
      },
    },
    {
      name: "Norah Jones",
      city: "New York",
      time: "1:00 PM",
      avatar: {
        src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Woman holding a coffee cup",
      },
    },
    {
      name: "Leslie Feist",
      city: "San Francisco",
      time: "10:00 AM",
      avatar: {
        src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Woman with short hair under a blue sky",
      },
    },
    {
      name: "Lorde",
      city: "Auckland",
      time: "7:00 AM",
      avatar: {
        src: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Laughing woman in a white top",
      },
    },
  ],
  wakeIndex: 3,
  beforeTime: "6:59 AM",
  asleepLabel: "Lorde starts her day in Auckland in a minute",
  awakeLabel: "Lorde picked up where Thom left off",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "wake", wake: "rest" };
const HOLD: Record<Phase, number> = { rest: 5, reset: 2.4, wake: 0.6 };

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

export function Location10({
  title,
  onlineTemplate,
  members = [],
  wakeIndex = 0,
  beforeTime,
  asleepLabel,
  awakeLabel,
  framed = true,
  stepMs = 900,
  className,
}: Location10Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const asleep = phase === "reset";
  const hasSleeper = wakeIndex >= 0 && wakeIndex < members.length;
  const count = members.length - (asleep && hasSleeper ? 1 : 0);
  const online = onlineTemplate?.replace("{count}", String(count));

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes location10-ping { from { transform: scale(1); opacity: 0.6; } to { transform: scale(2.6); opacity: 0; } }
.location10-ping { animation: location10-ping 1200ms ease-out 1 both; }
@media (prefers-reduced-motion: reduce) { .location10-ping { animation: none; opacity: 0; } }
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
          <div className="flex items-baseline justify-between gap-4">
            <p className="truncate text-lg tracking-tight">{title}</p>
            {online && <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{online}</p>}
          </div>

          <ul className="mt-4 flex flex-col">
            {members.map((member, index) => {
              const isSleeper = index === wakeIndex;
              const away = isSleeper && asleep;
              return (
                <li key={index} className="flex h-14 items-center gap-3 border-t border-border first:border-t-0">
                  <span className="relative shrink-0">
                    <img
                      src={member.avatar.src}
                      alt={member.avatar.alt}
                      className={cn(
                        "size-9 rounded-md object-cover transition-[filter,opacity] duration-700 motion-reduce:transition-none",
                        away ? "opacity-50 grayscale" : "opacity-100 grayscale-0"
                      )}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 grid size-3 place-items-center" aria-hidden="true">
                      {isSleeper && phase === "wake" && (
                        <span className="location10-ping col-start-1 row-start-1 size-3 rounded-full bg-emerald-500" />
                      )}
                      <span
                        className={cn(
                          "col-start-1 row-start-1 size-3 rounded-full ring-2 ring-card transition-colors duration-500 motion-reduce:transition-none",
                          away ? "bg-muted-foreground/40" : "bg-emerald-500"
                        )}
                      />
                    </span>
                  </span>
                  <div className={cn("min-w-0 flex-1 transition-opacity duration-700", away ? "opacity-60" : "opacity-100")}>
                    <p className="truncate text-base">{member.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{member.city}</p>
                  </div>
                  <span className="relative grid shrink-0 justify-items-end text-sm tabular-nums">
                    {isSleeper && beforeTime ? (
                      <>
                        <span
                          className={cn(
                            "col-start-1 row-start-1 text-muted-foreground transition-all duration-500 motion-reduce:transition-none",
                            away ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                          )}
                        >
                          {beforeTime}
                        </span>
                        <span
                          className={cn(
                            "col-start-1 row-start-1 transition-all duration-500 motion-reduce:transition-none",
                            away ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
                          )}
                        >
                          {member.time}
                        </span>
                      </>
                    ) : (
                      <span>{member.time}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-2 grid border-t border-border pt-4 text-sm text-muted-foreground">
            <p
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none",
                asleep ? "opacity-100" : "opacity-0"
              )}
            >
              {asleepLabel}
            </p>
            <p
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none",
                asleep ? "opacity-0" : "opacity-100"
              )}
            >
              {awakeLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
