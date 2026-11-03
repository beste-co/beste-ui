"use client";

import { Award, Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Education31Props {
  course?: string;
  provider?: string;
  lessons?: string[];
  /** Use {done} and {total}, as in "{done} of {total} lessons". */
  progressTemplate?: string;
  certificateLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const education31Demo: Education31Props = {
  course: "Leading through change",
  provider: "Halcyon Academy, covered by your learning budget",
  lessons: ["Naming what is changing", "Holding steady 1 on 1s", "Planning the first 90 days", "Bringing the team along"],
  progressTemplate: "{done} of {total} lessons",
  certificateLabel: "Certificate ready",
  framed: true,
  stepMs: 900,
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

/* Step 0 clears every lesson, steps 1 to n tick one off each, and the last step shows the certificate and holds. */
export function Education31({
  course,
  provider,
  lessons = [],
  progressTemplate = "",
  certificateLabel,
  framed = true,
  stepMs = 900,
  className,
}: Education31Props) {
  const total = lessons.length;
  const last = total + 1;
  const [step, setStep] = useState(last);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const delay = step === last ? stepMs * 6 : step === 0 ? stepMs * 1.4 : stepMs;
    const id = setTimeout(() => setStep(step >= last ? 0 : step + 1), delay);
    return () => clearTimeout(id);
  }, [step, last, stepMs]);

  const done = Math.min(step, total);
  const finished = step === last;
  const progress = progressTemplate.replace("{done}", String(done)).replace("{total}", String(total));

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
          <p className="text-lg tracking-tight">{course}</p>
          <p className="text-sm text-muted-foreground">{provider}</p>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <span
              className="block h-full origin-left rounded-full bg-primary transition-transform duration-700 ease-out motion-reduce:transition-none"
              style={{ transform: `scaleX(${total > 0 ? done / total : 0})` }}
            />
          </div>

          <ul className="mt-4">
            {lessons.map((lesson, index) => {
              const ticked = index < done;
              return (
                <li key={index} className="flex h-11 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                      ticked ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    )}
                  >
                    <Check
                      className={cn(
                        "size-3 transition-all duration-300 ease-out motion-reduce:transition-none",
                        ticked ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "truncate text-base transition-colors duration-300",
                      ticked ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {lesson}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 border-t border-border pt-4">
            <span className="relative grid">
              <span
                className={cn(
                  "col-start-1 row-start-1 text-sm tabular-nums text-muted-foreground transition-opacity duration-500",
                  finished ? "opacity-0" : "opacity-100"
                )}
              >
                {progress}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 flex items-center gap-2 text-sm text-foreground transition-all duration-500 ease-out motion-reduce:transition-none",
                  finished ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                )}
              >
                <Award className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {certificateLabel}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
