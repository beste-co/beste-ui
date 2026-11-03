"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "filled" | "clear" | "drop" | "frames";

type Ratio = "square" | "story" | "banner";

interface Variant {
  label: string;
  size: string;
  ratio: Ratio;
}

interface Upload34Props {
  image?: { src: string; alt: string };
  fileName?: string;
  fileSize?: string;
  variants?: Variant[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const upload34Demo: Upload34Props = {
  image: {
    src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=1200&auto=format&fit=crop",
    alt: "Woman with short hair looking over her shoulder against a blue sky",
  },
  fileName: "spring-hero.jpg",
  fileSize: "4000 × 2667",
  variants: [
    { label: "Square", size: "1080 × 1080", ratio: "square" },
    { label: "Story", size: "1080 × 1920", ratio: "story" },
    { label: "Banner", size: "1500 × 500", ratio: "banner" },
  ],
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = {
  filled: "clear",
  clear: "drop",
  drop: "frames",
  frames: "filled",
};

/* How long each phase lasts, in steps. */
const HOLD: Record<Phase, number> = {
  filled: 3.5,
  clear: 1,
  drop: 1.2,
  frames: 1.4,
};

/* Every frame shares one row height, so the variants line up on their bottom edge. */
const frameClasses: Record<Ratio, string> = {
  square: "size-24",
  story: "h-32 w-18",
  banner: "h-16 w-48",
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

export function Upload34({
  image,
  fileName,
  fileSize,
  variants = [],
  framed = true,
  stepMs = 900,
  className,
}: Upload34Props) {
  const [phase, setPhase] = useState<Phase>("filled");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const fileIn = phase !== "clear";
  const framesIn = phase === "frames" || phase === "filled";
  const cropsIn = phase === "filled";

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
          <div
            className={cn(
              "flex items-center gap-3 transition-all duration-500 ease-out motion-reduce:transition-none",
              fileIn ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
            )}
          >
            {image && <img src={image.src} alt={image.alt} className="size-11 shrink-0 rounded-md object-cover" />}
            <div className="min-w-0 flex-1">
              {fileName && <p className="truncate text-base">{fileName}</p>}
              {fileSize && <p className="truncate text-sm tabular-nums text-muted-foreground">{fileSize}</p>}
            </div>
          </div>

          {variants.length > 0 && (
            <div className="mt-5 flex items-end gap-3 border-t border-border pt-5">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col transition-all duration-500 ease-out motion-reduce:transition-none",
                    framesIn ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  )}
                  style={{ transitionDelay: framesIn && phase === "frames" ? `${index * 160}ms` : undefined }}
                >
                  <div className={cn("relative overflow-hidden rounded-md bg-muted", frameClasses[variant.ratio])}>
                    {image && (
                      <img
                        src={image.src}
                        alt=""
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none",
                          cropsIn ? "opacity-100" : "opacity-0"
                        )}
                        style={{ transitionDelay: cropsIn ? `${index * 160}ms` : undefined }}
                      />
                    )}
                  </div>
                  <p className="mt-2.5 text-sm">{variant.label}</p>
                  <p className="text-sm tabular-nums text-muted-foreground">{variant.size}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
