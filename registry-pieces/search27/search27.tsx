"use client";

import { ArrowUpRight, FileText, Search, Sparkle } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Article {
  title: string;
  meta?: string;
}

interface Search27Props {
  question?: string;
  answer?: string;
  articles?: Article[];
  /** Frosted rim around each card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const search27Demo: Search27Props = {
  question: "How do I add a teammate to a shared inbox?",
  answer: "Open Settings, choose Inboxes and select Invite. Your teammate gets access as soon as they accept.",
  articles: [
    { title: "Invite teammates to an inbox", meta: "2 min read" },
    { title: "Roles and inbox permissions", meta: "4 min read" },
  ],
  framed: true,
  stepMs: 700,
};

/* The stack is drawn at a fixed width and scaled down to fit small slots, so its proportions never change. */
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

/* Step 0 is empty, 1 asks, 2 answers, then one article per step. The last step holds before the loop clears it. */
export function Search27({ question, answer, articles = [], framed = true, stepMs = 700, className }: Search27Props) {
  const last = articles.length + 2;
  const [step, setStep] = useState(last);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const delay = step === last ? stepMs * 7 : step === 0 ? stepMs * 1.5 : step === 1 ? stepMs * 1.6 : stepMs;
    const id = setTimeout(() => setStep(step >= last ? 0 : step + 1), delay);
    return () => clearTimeout(id);
  }, [step, last, stepMs]);

  const frame = cn(
    "transition-all duration-500 ease-out motion-reduce:transition-none",
    framed && "rounded-2xl border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
  );
  const shown = (from: number) => (step >= from ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0");

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
        <div className={cn(frame, shown(1))}>
          <div className="flex items-center gap-3 rounded-lg bg-card px-5 py-4 text-card-foreground shadow-xs">
            <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="min-w-0 flex-1 text-base">{question}</p>
          </div>
        </div>

        <div className={cn(frame, shown(2))}>
          <div className="rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs">
            <div className="flex gap-3">
              <Sparkle className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-base leading-relaxed">{answer}</p>
            </div>
            {articles.length > 0 && (
              <ul className="mt-5 flex flex-col border-t border-border pt-2">
                {articles.map((article, index) => (
                  <li
                    key={index}
                    className={cn(
                      "flex items-center gap-3 py-3 transition-all duration-500 ease-out motion-reduce:transition-none",
                      step >= index + 3 ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                      <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base">{article.title}</p>
                      {article.meta && <p className="truncate text-sm text-muted-foreground">{article.meta}</p>}
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
