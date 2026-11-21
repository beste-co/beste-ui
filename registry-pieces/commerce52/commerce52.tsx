"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Layer = "none" | "surface" | "text" | "controls";

interface Commerce52Props {
  image?: string;
  /** A small tag over the photo */
  badge?: string;
  name?: string;
  price?: string;
  note?: string;
  /** Color dots, as any CSS colors */
  swatches?: string[];
  button?: string;
  /** The wash of color on the ground sheet, any CSS color */
  tint?: string;
  /** Distance between two layers, in pixels */
  gap?: number;
  /** Let the layers rise and fall slowly */
  animated?: boolean;
  className?: string;
}

export const commerce52Demo: Commerce52Props = {
  image: "https://oud.pics/b/beste/object-bowls.webp",
  badge: "New",
  name: "Stoneware bowls",
  price: "€36",
  note: "Set of two, glazed by hand",
  swatches: ["#c4673f", "#5d8468", "#1f1d1b"],
  button: "Add to cart",
  tint: "#e9dccb",
  gap: 42,
  animated: true,
};

const STYLES = `
@keyframes commerce52-float { from { transform: translateZ(calc(var(--commerce52-z) - 5px)) } to { transform: translateZ(calc(var(--commerce52-z) + 5px)) } }
.commerce52-layer { transform: translateZ(var(--commerce52-z)) }
.commerce52-live .commerce52-layer { animation: commerce52-float 4.5s ease-in-out infinite alternate }
@media (prefers-reduced-motion: reduce) { .commerce52-live .commerce52-layer { animation: none } }
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

export function Commerce52({ image, badge, name, price, note, swatches = [], button, tint = "#e9dccb", gap = 42, animated = true, className }: Commerce52Props) {
  // One layout drawn once per layer, so the layers always register
  const scene = (layer: Layer, shade = false) => {
    const p = painter(layer, shade);
    return (
      <div className="flex flex-col p-5 text-left">
        <div className="relative h-40">
          {shade || !image ? (
            <div className={p.fill("surface", "absolute inset-0 rounded-2xl", "bg-muted")} />
          ) : (
            <img src={image} alt="" className={cn("absolute inset-0 size-full rounded-2xl object-cover ring-1 ring-black/5", layer !== "surface" && "invisible")} />
          )}
          {badge && <span className={p.fill("controls", "absolute top-3 left-3 inline-flex h-7 items-center rounded-full px-3 text-sm", "bg-card text-card-foreground shadow-md")}>{badge}</span>}
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <p className={p.ink("text", "text-lg font-medium tracking-tight")}>{name}</p>
          <p className={p.ink("text", "text-lg font-medium")}>{price}</p>
        </div>
        {note && <p className={p.ink("text", "mt-1 text-sm", "text-muted-foreground")}>{note}</p>}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex gap-1.5">
            {swatches.map((color, index) => (
              <span key={index} style={shade ? undefined : { backgroundColor: color }} className={p.fill("controls", "size-6 rounded-full", "")} />
            ))}
          </span>
          {button && <span className={p.fill("controls", "inline-flex h-10 items-center rounded-full px-4.5 text-sm", "bg-primary text-primary-foreground")}>{button}</span>}
        </div>
      </div>
    );
  };

  const levels: Layer[] = ["surface", "text", "controls"];
  const lift = (level: number, delay: number) => ({ "--commerce52-z": `${gap * level}px`, animationDelay: `${delay}s` }) as CSSProperties;
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
              className={cn("relative", animated && "commerce52-live")}
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
                <div key={layer} style={lift(index + 1, index * -1.3)} className="commerce52-layer absolute inset-0 text-card-foreground">
                  {scene(layer)}
                </div>
              ))}
              {/* A pane of glass on top */}
              <div
                style={{ ...lift(4, -3.9), background: "linear-gradient(125deg, rgb(255 255 255 / 0.3), rgb(255 255 255 / 0.05) 36%, rgb(255 255 255 / 0) 62%)" }}
                className="commerce52-layer absolute inset-0 rounded-3xl border border-white/70 shadow-[0_0_0_1px_rgb(20_24_40/0.07)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
