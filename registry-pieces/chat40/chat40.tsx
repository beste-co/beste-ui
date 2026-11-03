"use client";

import { Check, SendHorizontal, Sparkle } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Chat40Props {
  customerName?: string;
  customerAvatar?: { src: string; alt: string };
  time?: string;
  message?: string;
  suggestionLabel?: string;
  reply?: string;
  sendLabel?: string;
  sentLabel?: string;
  /** Name on the cursor that presses Send. */
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  /** Delay between words while the reply composes. */
  typeMs?: number;
  className?: string;
}

export const chat40Demo: Chat40Props = {
  customerName: "Joni Mitchell",
  customerAvatar: {
    src: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=200&h=200&auto=format&fit=crop",
    alt: "Laughing woman in a white top",
  },
  time: "9:41 AM",
  message: "Hi, I was charged twice for my May invoice. Could you take a look?",
  suggestionLabel: "Suggested reply",
  reply: "Sorry about that, Joni. I refunded the duplicate $49 charge, and it should reach your card in 3 to 5 days.",
  sendLabel: "Send",
  sentLabel: "Sent",
  framed: true,
  stepMs: 800,
  typeMs: 110,
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

/* Parked left of the Send button; glides onto it, presses, and drifts back once the reply is sent. */
function Cursor({ label, onTarget, pressing }: { label?: string; onTarget: boolean; pressing: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
      style={{ transform: onTarget ? "translate(0.5rem, 0.25rem)" : "translate(-5rem, 0.75rem)" }}
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

/* Step 0 is empty, 1 shows the message, 2 the suggestion, then one word per step.
   The cursor then glides to Send, presses it, and the sent state holds before the cursor leaves. */
export function Chat40({
  customerName,
  customerAvatar,
  time,
  message,
  suggestionLabel,
  reply = "",
  sendLabel,
  sentLabel,
  cursorLabel,
  framed = true,
  stepMs = 800,
  typeMs = 110,
  className,
}: Chat40Props) {
  const words = reply.split(" ").filter(Boolean);
  const typed = words.length + 2;
  const approach = typed + 1;
  const press = typed + 2;
  const settle = typed + 3;
  const last = typed + 4;
  const [step, setStep] = useState(last);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const delay =
      step === last
        ? stepMs * 4
        : step === 0
          ? stepMs * 1.5
          : step === approach || step === settle
            ? stepMs * 1.2
            : step === press
              ? stepMs * 0.4
              : step >= 3 && step < typed
                ? typeMs
                : stepMs;
    const id = setTimeout(() => setStep(step >= last ? 0 : step + 1), delay);
    return () => clearTimeout(id);
  }, [step, last, settle, press, approach, typed, stepMs, typeMs]);

  const shown = (from: number) => (step >= from ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0");
  const sent = step >= settle;
  const pressing = step === press;
  const onTarget = step >= approach && step <= settle;

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
        <div className="rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs">
          <div className={cn("transition-all duration-500 ease-out motion-reduce:transition-none", shown(1))}>
            <div className="flex items-center gap-3">
              {customerAvatar && (
                <img
                  src={customerAvatar.src}
                  alt={customerAvatar.alt}
                  className="size-10 shrink-0 rounded-md object-cover"
                />
              )}
              <p className="min-w-0 flex-1 truncate text-lg font-normal tracking-tight">{customerName}</p>
              {time && <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{time}</span>}
            </div>
            {message && <p className="mt-4 rounded-lg bg-muted px-4 py-3 text-base leading-relaxed">{message}</p>}
          </div>

          <div
            className={cn(
              "mt-5 border-t border-border pt-5 transition-all duration-500 ease-out motion-reduce:transition-none",
              shown(2)
            )}
          >
            {suggestionLabel && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkle className="size-4 text-primary" aria-hidden="true" />
                {suggestionLabel}
              </p>
            )}
            <p className="mt-3 text-base leading-relaxed">
              {words.map((word, index) => (
                <span key={index}>
                  <span
                    className={cn(
                      "transition-opacity duration-500 ease-out motion-reduce:transition-none",
                      step >= index + 3 ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {word}
                  </span>
                  {index < words.length - 1 && " "}
                </span>
              ))}
            </p>

            <div className="mt-5 flex justify-end">
              <span className="relative flex">
                <span
                  className={cn(
                    "grid h-10 items-center rounded-md border border-border bg-card px-4 text-sm shadow-xs transition-all duration-300 ease-out motion-reduce:transition-none",
                    step < typed && "opacity-50",
                    pressing && "scale-95 bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "col-start-1 row-start-1 inline-flex items-center justify-center gap-2 transition-opacity duration-300",
                      sent ? "opacity-0" : "opacity-100"
                    )}
                  >
                    {sendLabel}
                    <SendHorizontal className="size-4" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "col-start-1 row-start-1 inline-flex items-center justify-center gap-2 text-emerald-600 transition-opacity duration-300 dark:text-emerald-400",
                      sent ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <Check className="size-4" aria-hidden="true" />
                    {sentLabel}
                  </span>
                </span>
                <Cursor label={cursorLabel} onTarget={onTarget} pressing={pressing} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
