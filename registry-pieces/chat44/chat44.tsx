"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "empty" | "question" | "typing" | "reply" | "rest";

interface Message {
  name: string;
  time: string;
  text: string;
  /** A photo, or leave it out to show the first letter of the name. */
  avatar?: { src: string; alt: string };
}

interface Chat44Props {
  question?: Message;
  reply?: Message;
  /** Quiet line at the foot of the thread, as in "Answered in 2 minutes". */
  footnote?: string;
  /** Fixed card height in px, so cards set side by side match; content sits inside it. */
  height?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const chat44Demo: Chat44Props = {
  question: {
    name: "Joni Mitchell",
    time: "9:12 AM",
    text: "Is the role open to people working from Lisbon?",
    avatar: {
      src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman with long dark hair holding a coffee cup",
    },
  },
  reply: {
    name: "Halcyon hiring team",
    time: "9:14 AM",
    text: "Yes. The team works fully remote across Europe, and we meet in person twice a year.",
  },
  footnote: "Answered in 2 minutes",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { empty: "question", question: "typing", typing: "reply", reply: "rest", rest: "empty" };
const HOLD: Record<Phase, number> = { empty: 0.8, question: 1.2, typing: 1.6, reply: 0.8, rest: 5 };
const ORDER: Phase[] = ["empty", "question", "typing", "reply", "rest"];

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

function Sender({ message }: { message: Message }) {
  return (
    <div className="flex items-center gap-2.5">
      {message.avatar ? (
        <img src={message.avatar.src} alt={message.avatar.alt} className="size-7 shrink-0 rounded-md object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground"
        >
          {message.name.charAt(0)}
        </span>
      )}
      <p className="min-w-0 truncate text-sm">{message.name}</p>
      <p className="ml-auto shrink-0 text-sm tabular-nums text-muted-foreground">{message.time}</p>
    </div>
  );
}

export function Chat44({ question, reply, footnote, height, framed = true, stepMs = 900, className }: Chat44Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    if (entrance.still) return;
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs, entrance.still]);

  const at = ORDER.indexOf(phase);
  const reveal = (shown: boolean) =>
    cn(
      "transition-all duration-500 ease-out motion-reduce:transition-none",
      shown ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
    );

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes chat44-dot { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
.chat44-dot { animation: chat44-dot 1200ms ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .chat44-dot { animation: none; } }
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
        <div
          className="flex flex-col rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs"
          style={height ? { height } : undefined}
        >
          {question && (
            <div className={reveal(at >= 1)}>
              <Sender message={question} />
              <p className="mt-2 text-base leading-relaxed">{question.text}</p>
            </div>
          )}

          {reply && (
            <div className={cn("mt-5 border-t border-border pt-5", reveal(at >= 2))}>
              <Sender message={reply} />
              {/* The typing dots and the reply share one cell, so the thread never shifts. */}
              <div className="mt-2 grid">
                <span
                  aria-hidden="true"
                  className={cn(
                    "col-start-1 row-start-1 flex h-7 items-center gap-1 transition-opacity duration-300",
                    phase === "typing" ? "opacity-100" : "opacity-0"
                  )}
                >
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="chat44-dot size-1.5 rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${dot * 160}ms` }}
                    />
                  ))}
                </span>
                <p
                  className={cn(
                    "col-start-1 row-start-1 text-base leading-relaxed transition-opacity duration-500 motion-reduce:transition-none",
                    at >= 3 ? "opacity-100" : "opacity-0"
                  )}
                >
                  {reply.text}
                </p>
              </div>
            </div>
          )}

          {footnote && (
            <p
              className={cn(
                "mt-auto pt-5 text-sm text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                at >= 4 ? "opacity-100" : "opacity-0"
              )}
            >
              {footnote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
