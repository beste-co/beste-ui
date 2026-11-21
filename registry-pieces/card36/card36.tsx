"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Layer = "none" | "surface" | "text" | "controls";

interface Card36Props {
  plan?: string;
  /** A small tag beside the plan name */
  badge?: string;
  price?: string;
  period?: string;
  features?: string[];
  button?: string;
  /** The wash of color on the ground sheet, any CSS color */
  tint?: string;
  /** Distance between two layers, in pixels */
  gap?: number;
  /** Let the layers rise and fall slowly */
  animated?: boolean;
  className?: string;
}

export const card36Demo: Card36Props = {
  plan: "Studio",
  badge: "Popular",
  price: "$29",
  period: "a month, billed yearly",
  features: ["Unlimited projects", "Your own domain", "Priority support"],
  button: "Start free trial",
  tint: "#d9dcf5",
  gap: 42,
  animated: true,
};

const STYLES = `
@keyframes card36-float { from { transform: translateZ(calc(var(--card36-z) - 5px)) } to { transform: translateZ(calc(var(--card36-z) + 5px)) } }
.card36-layer { transform: translateZ(var(--card36-z)) }
.card36-live .card36-layer { animation: card36-float 4.5s ease-in-out infinite alternate }
@media (prefers-reduced-motion: reduce) { .card36-live .card36-layer { animation: none } }
`;

// The cut edge of the ground sheet, a step darker than its face
const sheetEdge = "color-mix(in oklab, var(--card) 78%, var(--foreground))";

/** Each part names the layer it belongs to; `shade` paints the same shapes as a flat shadow. */
function painter(layer: Layer, shade: boolean) {
  const hide = (own: Layer) => own !== layer && "invisible";
  return {
    fill: (own: Layer, shape: string, colors: string) => cn(shape, hide(own), shade ? "bg-black text-transparent" : colors),
    ink: (own: Layer, shape: string, colors = "") => cn(shape, hide(own), shade ? "text-black" : colors),
  };
}

export function Card36({ plan, badge, price, period, features = [], button, tint = "#d9dcf5", gap = 42, animated = true, className }: Card36Props) {
  // One layout drawn once per layer, so the layers always register
  const scene = (layer: Layer, shade = false) => {
    const p = painter(layer, shade);
    return (
      <div className="flex flex-col p-5 text-left">
        <div className="flex items-center justify-between gap-3">
          <p className={p.ink("text", "text-lg font-medium tracking-tight")}>{plan}</p>
          {badge && <span className={p.fill("controls", "inline-flex h-7 items-center rounded-full px-3 text-sm", "bg-foreground text-background")}>{badge}</span>}
        </div>
        <p className={p.ink("text", "mt-3 text-5xl leading-none font-medium tracking-tighter")}>{price}</p>
        {period && <p className={p.ink("text", "mt-1.5 text-sm", "text-muted-foreground")}>{period}</p>}
        {features.length > 0 && (
          <div className="relative mt-4 flex flex-col gap-2.5 p-3.5">
            <div className={p.fill("surface", "absolute inset-0 rounded-2xl", "bg-muted")} />
            {features.map((feature, index) => (
              <div key={index} className="relative flex items-center gap-2.5">
                <span className={p.fill("controls", "size-4 shrink-0 rounded-full", "bg-foreground")} />
                <span className={p.ink("text", "text-sm")}>{feature}</span>
              </div>
            ))}
          </div>
        )}
        {button && <span className={p.fill("controls", "mt-4 inline-flex h-10 items-center justify-center rounded-full text-sm", "bg-primary text-primary-foreground")}>{button}</span>}
      </div>
    );
  };

  const levels: Layer[] = ["surface", "text", "controls"];
  const lift = (level: number, delay: number) => ({ "--card36-z": `${gap * level}px`, animationDelay: `${delay}s` }) as CSSProperties;
  // A layer's shadow lies on the ground sheet: the higher the layer, the further it falls and the softer it gets
  const cast = (level: number): CSSProperties => ({
    transform: `translate3d(${gap * level * 0.06}px, ${gap * level * 0.2}px, 1px)`,
    filter: `blur(${3 + level * 3}px)`,
    opacity: 0.26 - level * 0.04,
  });

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <div aria-hidden="true" className="relative h-88 w-80 shrink-0 select-none">
        <div className="absolute top-1/2 left-1/2 w-72 -translate-x-1/2 -translate-y-1/2 scale-[0.8]">
          <div style={{ perspective: "2600px" }}>
            <div
              style={{ transformStyle: "preserve-3d", transform: `rotateX(58deg) rotateZ(-38deg) translateZ(${-gap * 2}px)` }}
              className={cn("relative", animated && "card36-live")}
            >
              <div style={{ transform: "translate3d(14px, 46px, -34px)", filter: "blur(30px)" }} className="absolute inset-3 rounded-3xl bg-black/25" />
              <div style={{ transform: "translateZ(-6px)", background: sheetEdge }} className="absolute inset-0 rounded-3xl" />
              <div style={{ transform: "translateZ(-3px)", background: sheetEdge }} className="absolute inset-0 rounded-3xl" />
              {/* Ground sheet; the hidden layout inside gives the scene its size */}
              <div className="relative overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10">
                <div style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${tint} 60%, transparent), transparent 52%)` }} className="absolute inset-0" />
                {scene("none")}
              </div>
              {levels.map((layer, index) => (
                <div key={`shade-${layer}`} style={cast(index + 1)} className="absolute inset-0">
                  {scene(layer, true)}
                </div>
              ))}
              {levels.map((layer, index) => (
                <div key={layer} style={lift(index + 1, index * -1.3)} className="card36-layer absolute inset-0 text-card-foreground">
                  {scene(layer)}
                </div>
              ))}
              {/* A pane of glass on top */}
              <div
                style={{ ...lift(4, -3.9), background: "linear-gradient(125deg, rgb(255 255 255 / 0.3), rgb(255 255 255 / 0.05) 36%, rgb(255 255 255 / 0) 62%)" }}
                className="card36-layer absolute inset-0 rounded-3xl border border-white/70 shadow-[0_0_0_1px_rgb(20_24_40/0.07)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
