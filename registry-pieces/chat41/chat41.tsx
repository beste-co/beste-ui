"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "empty" | "question" | "typing" | "answer" | "rest";

interface Chat41Props {
  sender?: { name: string; avatar: { src: string; alt: string } };
  question?: string;
  answer?: string;
  footnote?: string;
  /** Fixed card height in px, so cards set side by side match; content sits inside it. */
  height?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const chat41Demo: Chat41Props = {
  sender: {
    name: "Joni Mitchell",
    avatar: {
      src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman with long dark hair holding a coffee cup",
    },
  },
  question: "Is the role open to people working from Lisbon?",
  answer: "Yes. The team works fully remote across Europe, and we meet in person twice a year.",
  footnote: "Answered in 2 minutes",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { empty: "question", question: "typing", typing: "answer", answer: "rest", rest: "empty" };
const HOLD: Record<Phase, number> = { empty: 0.8, question: 1.2, typing: 1.6, answer: 0.8, rest: 4 };
const ORDER: Phase[] = ["empty", "question", "typing", "answer", "rest"];

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

export function Chat41({
  sender,
  question,
  answer,
  footnote,
  framed = true,
  stepMs = 900,
  className,
  height,
}: Chat41Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const at = ORDER.indexOf(phase);
  const reveal = (visible: boolean) =>
    cn(
      "transition-all duration-500 ease-out motion-reduce:transition-none",
      visible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
    );

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes chat41-dot { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }
.chat41-dot { animation: chat41-dot 1200ms ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .chat41-dot { animation: none; } }
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
        {/* Given a height, the messages settle at the bottom like a chat. */}
        <div
          className={cn("flex flex-col gap-4 rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs", height && "justify-end")}
          style={height ? { height } : undefined}
        >
          <div className={cn("flex items-end gap-3", reveal(at >= 1))}>
            {sender && (
              <img src={sender.avatar.src} alt={sender.avatar.alt} className="size-8 shrink-0 rounded-md object-cover" />
            )}
            <p className="max-w-xs rounded-lg bg-muted px-4 py-2.5 text-base">{question}</p>
          </div>

          <div className="relative flex justify-end">
            <span
              aria-hidden="true"
              className={cn(
                "absolute right-0 top-0 flex gap-1 rounded-lg bg-primary/10 px-4 py-4 transition-opacity duration-300",
                phase === "typing" ? "opacity-100" : "opacity-0"
              )}
            >
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="chat41-dot size-1.5 rounded-full bg-primary"
                  style={{ animationDelay: `${dot * 160}ms` }}
                />
              ))}
            </span>
            <p
              className={cn(
                "max-w-xs rounded-lg bg-primary px-4 py-2.5 text-base text-primary-foreground",
                reveal(at >= 3)
              )}
            >
              {answer}
            </p>
          </div>

          <p className={cn("text-right text-sm text-muted-foreground", reveal(at >= 4))}>{footnote}</p>
        </div>
      </div>
    </div>
  );
}
