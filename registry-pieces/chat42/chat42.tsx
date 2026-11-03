"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "typing" | "shown";

interface ThreadMessage {
  name: string;
  avatar: { src: string; alt: string };
  text: string;
  time: string;
}

interface Chat42Props {
  channel?: string;
  /** Shown after the next sender's first name while they write. */
  typingLabel?: string;
  messages?: ThreadMessage[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const chat42Demo: Chat42Props = {
  channel: "#pricing-page",
  typingLabel: "is typing",
  messages: [
    {
      name: "Bill Withers",
      avatar: {
        src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Smiling man in a floral shirt",
      },
      text: "Annual plan: 2 months free, or 20% off?",
      time: "10:02",
    },
    {
      name: "Carole King",
      avatar: {
        src: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Laughing woman in a white top",
      },
      text: "2 months free read clearer in every test we ran.",
      time: "10:04",
    },
    {
      name: "Norah Jones",
      avatar: {
        src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Woman holding a coffee cup",
      },
      text: "Agreed. Let's ship it with the new page on the 14th.",
      time: "10:05",
    },
  ],
  framed: true,
  stepMs: 900,
};

const HOLD: Record<Phase, number> = { rest: 4.5, reset: 0.9, typing: 1.5, shown: 0.9 };

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

export function Chat42({ channel, typingLabel, messages = [], framed = true, stepMs = 900, className }: Chat42Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  /* How many messages are on screen; the loop types them in one at a time. */
  const [count, setCount] = useState(messages.length);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => {
      if (phase === "rest") {
        setCount(0);
        setPhase("reset");
      } else if (phase === "reset") {
        setPhase(messages.length > 0 ? "typing" : "rest");
      } else if (phase === "typing") {
        setCount((current) => current + 1);
        setPhase("shown");
      } else {
        setPhase(count < messages.length ? "typing" : "rest");
      }
    }, HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, count, messages.length, stepMs]);

  const typing = phase === "typing";
  /* Keep the last writer's name while the line fades out. */
  const writer = messages[typing ? count : count - 1];

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes chat42-dot { 0%, 60%, 100% { opacity: 0.25; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }
.chat42-dot { animation: chat42-dot 1200ms ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .chat42-dot { animation: none; } }
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
          <p className="text-lg tracking-tight">{channel}</p>

          <ul className="mt-4 space-y-5 border-t border-border pt-5">
            {messages.map((message, index) => {
              const visible = index < count;
              return (
                <li
                  key={index}
                  className={cn(
                    "flex gap-3 transition-all duration-500 ease-out motion-reduce:transition-none",
                    visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  )}
                >
                  <img
                    src={message.avatar.src}
                    alt={message.avatar.alt}
                    className="size-9 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <p className="flex items-baseline gap-2">
                      <span className="truncate text-sm">{message.name}</span>
                      <span className="text-sm tabular-nums text-muted-foreground">{message.time}</span>
                    </p>
                    <p className="mt-0.5 text-base leading-snug">{message.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p
            aria-hidden={!typing}
            className={cn(
              "mt-5 flex h-5 items-center gap-2 text-sm text-muted-foreground transition-opacity duration-300 motion-reduce:transition-none",
              typing ? "opacity-100" : "opacity-0"
            )}
          >
            <span className="flex gap-0.5" aria-hidden="true">
              <span className="chat42-dot size-1 rounded-full bg-current" />
              <span className="chat42-dot size-1 rounded-full bg-current" style={{ animationDelay: "150ms" }} />
              <span className="chat42-dot size-1 rounded-full bg-current" style={{ animationDelay: "300ms" }} />
            </span>
            {writer && `${writer.name.split(" ")[0]} ${typingLabel ?? ""}`}
          </p>
        </div>
      </div>
    </div>
  );
}
