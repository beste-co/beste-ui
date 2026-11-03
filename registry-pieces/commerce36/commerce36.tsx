"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "browse" | "approach" | "press" | "paid";

interface Commerce36Props {
  product?: { title: string; detail: string; price: string; image: { src: string; alt: string } };
  buyLabel?: string;
  paidLabel?: string;
  /** The note the maker receives once the order is paid. */
  order?: { title: string; detail: string; amount: string };
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const commerce36Demo: Commerce36Props = {
  product: {
    title: "Blue cove, giclee print",
    detail: "A3 on cotton paper, signed by hand",
    price: "$48",
    image: {
      src: "https://images.unsplash.com/photo-1781708897820-e1cda3d96180?q=80&w=1600&auto=format&fit=crop",
      alt: "Painting of coastal hills and a blue cove",
    },
  },
  buyLabel: "Buy now",
  paidLabel: "Paid",
  order: { title: "New order from Nina Simone", detail: "Label printed, ships Friday", amount: "+$48" },
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "browse",
  browse: "approach",
  approach: "press",
  press: "paid",
  paid: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 0.8, browse: 1.2, approach: 1.2, press: 0.4, paid: 1 };

/* The card is drawn at a fixed width and scaled down to fit small slots, so its proportions never change. */
function useFitScale() {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const note = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  /* Room the order card needs below the product card; the pair is centered together. */
  const [extra, setExtra] = useState(0);
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
      const below = note.current ? note.current.offsetHeight + 10 : 0;
      setExtra(below);
      setScale(Math.min(1, w / i.offsetWidth, h > 0 ? h / (i.offsetHeight + below) : 1));
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

  return { outer, inner, note, scale, extra, entrance: { ...entrance, shown: entrance.shown && scale !== null } };
}

export function Commerce36({
  product,
  buyLabel,
  paidLabel,
  order,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Commerce36Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, note, scale, extra, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const paid = phase === "paid" || phase === "rest";
  const onButton = phase === "approach" || phase === "press";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className={cn(
          "relative w-sm shrink-0",
          framed && "rounded-2xl border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
        style={{
          transform: `translateY(${(-extra / 2) * (scale ?? 1)}px) scale(${scale ?? 1})`,
          opacity: entrance.shown ? 1 : 0,
          translate: entrance.shown ? "0 0" : "0 1.25rem",
          filter: entrance.shown ? "blur(0px)" : "blur(10px)",
          transition: entrance.still
            ? "none"
            : "opacity 1000ms ease-out, translate 1400ms cubic-bezier(0.16, 1, 0.3, 1), filter 1000ms ease-out",
          transitionDelay: `${entrance.delay}ms`,
        }}
      >
        <div className="rounded-lg bg-card p-3 text-card-foreground shadow-xs">
          <div className="flex items-center gap-3">
            {product && (
              <img
                src={product.image.src}
                alt={product.image.alt}
                className="size-20 shrink-0 rounded-md object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{product?.title}</p>
              <p className="truncate text-sm text-muted-foreground">{product?.detail}</p>

              <div className="mt-2.5 flex items-center justify-between gap-3">
                <p className="text-base tabular-nums">{product?.price}</p>
                <div className="relative">
                  <span
                    className={cn(
                      "grid h-7 place-items-center rounded-md px-2.5 text-sm transition-all duration-300 motion-reduce:transition-none",
                      paid ? "bg-foreground text-background" : "bg-primary text-primary-foreground",
                      phase === "press" && "scale-95 bg-primary/85"
                    )}
                  >
                    <span
                      className={cn(
                        "col-start-1 row-start-1 transition-opacity duration-300",
                        paid ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {buyLabel}
                    </span>
                    <span
                      className={cn(
                        "col-start-1 row-start-1 inline-flex items-center gap-1.5 transition-opacity duration-300",
                        paid ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      {paidLabel}
                    </span>
                  </span>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                    style={{ transform: onButton ? "translate(0.25rem, 0.125rem)" : "translate(-3rem, 3rem)" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className={cn(
                        "size-6 fill-foreground stroke-background transition-transform duration-150",
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
            </div>
          </div>
        </div>

        {/* The maker's order arrives as its own card under the product once the payment lands; it takes no space before. */}
        {order && (
          <div
            ref={note}
            aria-hidden={!paid}
            className={cn(
              "absolute right-0 top-full mt-2.5 w-72 transition-all duration-700 ease-out motion-reduce:transition-none",
              framed && "rounded-2xl border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md",
              paid ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
            )}
          >
            <div className="flex items-center gap-2.5 rounded-lg bg-card p-3 text-card-foreground shadow-xs">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
                <ShoppingBag className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{order.title}</p>
                <p className="truncate text-sm text-muted-foreground">{order.detail}</p>
              </div>
              <span className="shrink-0 text-sm tabular-nums">{order.amount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
