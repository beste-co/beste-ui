"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "clear" | "type" | "approach" | "press" | "sent";

interface Field {
  label: string;
  value: string;
}

interface Input33Props {
  title?: string;
  /** Fields that are already filled in. */
  fields?: Field[];
  /** The field that types itself out on every loop. */
  typed?: Field;
  sendLabel?: string;
  sentLabel?: string;
  /** A quiet line that appears once the welcome is sent. */
  note?: string;
  cursorLabel?: string;
  /** Fixed card height in px, so cards set side by side match; content sits inside it. */
  height?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  /** Delay between characters while the field types. */
  charMs?: number;
  className?: string;
}

export const input33Demo: Input33Props = {
  title: "Add a new hire",
  fields: [
    { label: "Name", value: "Norah Jones" },
    { label: "Start date", value: "Monday, November 9" },
  ],
  typed: { label: "Personal email", value: "hello@beste.co" },
  sendLabel: "Send welcome",
  sentLabel: "Welcome sent",
  note: "Norah gets her logins on Monday at 9:00 AM",
  framed: true,
  stepMs: 800,
  charMs: 70,
};

const NEXT: Record<Phase, Phase> = {
  rest: "clear",
  clear: "type",
  type: "approach",
  approach: "press",
  press: "sent",
  sent: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4, clear: 0.9, type: 0, approach: 1.2, press: 0.4, sent: 1 };

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

export function Input33({
  title,
  fields = [],
  typed,
  sendLabel,
  sentLabel,
  note,
  cursorLabel,
  framed = true,
  stepMs = 800,
  charMs = 70,
  className,
  height,
}: Input33Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const [chars, setChars] = useState(0);
  const { outer, inner, scale, entrance } = useFitScale();
  const full = typed?.value ?? "";

  useEffect(() => {
    const delay = phase === "type" ? full.length * charMs + 600 : HOLD[phase] * stepMs;
    const id = setTimeout(() => setPhase(NEXT[phase]), delay);
    return () => clearTimeout(id);
  }, [phase, stepMs, charMs, full.length]);

  useEffect(() => {
    if (phase !== "type") return;
    setChars(0);
    const id = setInterval(() => setChars((current) => Math.min(current + 1, full.length)), charMs);
    return () => clearInterval(id);
  }, [phase, charMs, full.length]);

  const shown = phase === "clear" ? "" : phase === "type" ? full.slice(0, chars) : full;
  const sent = phase === "sent" || phase === "rest";
  const onButton = phase === "approach" || phase === "press";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes input33-caret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
.input33-caret { animation: input33-caret 1000ms step-end infinite; }
@media (prefers-reduced-motion: reduce) { .input33-caret { animation: none; } }
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
          className={cn("rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs", height && "flex flex-col justify-between")}
          style={height ? { height } : undefined}
        >
          <p className="text-lg tracking-tight">{title}</p>

          <div className="mt-4 space-y-3">
            {fields.slice(0, 1).map((field, index) => (
              <FieldRow key={index} label={field.label} value={field.value} />
            ))}
            {typed && (
              <div>
                <p className="text-sm text-muted-foreground">{typed.label}</p>
                <div
                  className={cn(
                    "mt-1.5 flex h-10 items-center rounded-md border px-3 text-base transition-colors duration-300",
                    phase === "type" ? "border-primary/50" : "border-border"
                  )}
                >
                  <span className="truncate">{shown}</span>
                  {phase === "type" && (
                    <span aria-hidden="true" className="input33-caret ml-px h-5 w-px shrink-0 bg-foreground" />
                  )}
                </div>
              </div>
            )}
            {fields.slice(1).map((field, index) => (
              <FieldRow key={index} label={field.label} value={field.value} />
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <div className="relative">
              <span
                className={cn(
                  "relative grid h-9 items-center rounded-md px-4 text-sm transition-all duration-300 ease-out motion-reduce:transition-none",
                  sent ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-primary text-primary-foreground",
                  phase === "press" && "scale-95 bg-primary/85"
                )}
              >
                <span className={cn("col-start-1 row-start-1 text-center transition-opacity duration-300", sent ? "opacity-0" : "opacity-100")}>
                  {sendLabel}
                </span>
                <span
                  className={cn(
                    "col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 transition-opacity duration-300",
                    sent ? "opacity-100" : "opacity-0"
                  )}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  {sentLabel}
                </span>
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: onButton ? "translate(0.5rem, 0.25rem)" : "translate(-4rem, 1rem)" }}
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
          {note && (
            <p
              className={cn(
                "mt-4 h-5 truncate text-sm text-muted-foreground transition-all duration-500 ease-out motion-reduce:transition-none",
                sent ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
              )}
            >
              {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, value }: Field) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex h-10 items-center rounded-md border border-border px-3 text-base">
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}
