"use client";

import { FileText, Search } from "lucide-react";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "clear" | "type" | "found";

interface Result {
  title: string;
  section: string;
}

interface Search29Props {
  placeholder?: string;
  query?: string;
  /** Matched in each result title and softly marked, ignoring case. */
  highlight?: string;
  results?: Result[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  /** Delay between characters while the query types. */
  charMs?: number;
  className?: string;
}

export const search29Demo: Search29Props = {
  placeholder: "Search the handbook",
  query: "parental leave",
  highlight: "leave",
  results: [
    { title: "Parental leave policy", section: "People" },
    { title: "Requesting leave in the calendar", section: "Time off" },
    { title: "Coming back after a long leave", section: "People" },
  ],
  framed: true,
  stepMs: 800,
  charMs: 90,
};

const NEXT: Record<Phase, Phase> = { rest: "clear", clear: "type", type: "found", found: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, clear: 1, type: 0, found: 1.4 };

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

function Marked({ text, mark }: { text: string; mark?: string }) {
  if (!mark) return <>{text}</>;
  const parts = text.split(new RegExp(`(${mark.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === mark.toLowerCase() ? (
          <mark key={index} className="rounded-sm bg-primary/10 px-0.5 text-foreground">
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}

export function Search29({
  placeholder,
  query = "",
  highlight,
  results = [],
  framed = true,
  stepMs = 800,
  charMs = 90,
  className,
}: Search29Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const [chars, setChars] = useState(0);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const delay = phase === "type" ? query.length * charMs + 500 : HOLD[phase] * stepMs;
    const id = setTimeout(() => setPhase(NEXT[phase]), delay);
    return () => clearTimeout(id);
  }, [phase, stepMs, charMs, query.length]);

  useEffect(() => {
    if (phase !== "type") return;
    setChars(0);
    const id = setInterval(() => setChars((current) => Math.min(current + 1, query.length)), charMs);
    return () => clearInterval(id);
  }, [phase, charMs, query.length]);

  const shown = phase === "clear" ? "" : phase === "type" ? query.slice(0, chars) : query;
  const listed = phase === "found" || phase === "rest";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes search29-caret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
.search29-caret { animation: search29-caret 1000ms step-end infinite; }
@media (prefers-reduced-motion: reduce) { .search29-caret { animation: none; } }
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
          <div
            className={cn(
              "flex h-11 items-center gap-3 rounded-md border px-3 transition-colors duration-300",
              phase === "type" ? "border-primary/50" : "border-border"
            )}
          >
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="relative grid min-w-0 flex-1 text-base">
              <span
                className={cn(
                  "col-start-1 row-start-1 truncate text-muted-foreground transition-opacity duration-200",
                  shown ? "opacity-0" : "opacity-100"
                )}
              >
                {placeholder}
              </span>
              <span className="col-start-1 row-start-1 flex min-w-0 items-center">
                <span className="truncate">{shown}</span>
                {phase === "type" && (
                  <span aria-hidden="true" className="search29-caret ml-px h-5 w-px shrink-0 bg-foreground" />
                )}
              </span>
            </span>
          </div>

          <div className="mt-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "flex h-12 items-center gap-3 rounded-md px-3 transition-all duration-500 ease-out motion-reduce:transition-none",
                  listed ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
                  index === 0 && phase === "rest" ? "bg-muted" : "bg-transparent"
                )}
                style={{ transitionDelay: listed && phase === "found" ? `${index * 140}ms` : "0ms" }}
              >
                <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <p className="min-w-0 flex-1 truncate text-base">
                  <Marked text={result.title} mark={highlight} />
                </p>
                <p className="shrink-0 text-sm text-muted-foreground">{result.section}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
