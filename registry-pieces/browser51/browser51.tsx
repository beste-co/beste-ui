"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Layer = "none" | "surface" | "text" | "controls";

interface Browser51Props {
  brand?: string;
  nav?: string[];
  /** The small pill at the end of the bar */
  action?: string;
  image?: string;
  /** A small card resting on the photo's lower edge */
  card?: { title: string; detail: string };
  heading?: string;
  description?: string;
  /** Pills under the copy: the first is filled, the rest outlined */
  buttons?: string[];
  /** The wash of color on the ground sheet, any CSS color */
  tint?: string;
  /** Distance between two layers, in pixels */
  gap?: number;
  /** Let the layers rise and fall slowly */
  animated?: boolean;
  className?: string;
}

export const browser51Demo: Browser51Props = {
  brand: "Mira",
  nav: ["Treatments", "Visit us"],
  action: "Book",
  image: "https://oud.pics/b/dental/mira-consultation.webp",
  card: { title: "First visit", detail: "45 minutes" },
  heading: "Calm, careful dentistry for the whole family",
  description: "Unhurried appointments, clear plans and gentle hands.",
  buttons: ["Book a visit", "Treatments"],
  tint: "#cfe3e0",
  gap: 60,
  animated: true,
};

const STYLES = `
@keyframes browser51-float { from { transform: translateZ(calc(var(--browser51-z) - 5px)) } to { transform: translateZ(calc(var(--browser51-z) + 5px)) } }
.browser51-layer { transform: translateZ(var(--browser51-z)) }
.browser51-live .browser51-layer { animation: browser51-float 4.5s ease-in-out infinite alternate }
@media (prefers-reduced-motion: reduce) { .browser51-live .browser51-layer { animation: none } }
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

export function Browser51({ brand, nav = [], action, image, card, heading, description, buttons = [], tint = "#cfe3e0", gap = 60, animated = true, className }: Browser51Props) {
  // One layout drawn once per layer, so the layers always register
  const scene = (layer: Layer, shade = false) => {
    const p = painter(layer, shade);
    return (
      <div className="flex flex-col p-7 text-left">
        <div className="flex h-9 items-center justify-between gap-4">
          <span className={p.ink("text", "text-lg font-medium tracking-tight")}>{brand}</span>
          <span className="flex items-center gap-5">
            {nav.map((item, index) => (
              <span key={index} className={p.ink("text", "text-sm", "text-muted-foreground")}>
                {item}
              </span>
            ))}
            {action && <span className={p.fill("controls", "inline-flex h-9 items-center rounded-full px-4 text-sm", "bg-primary text-primary-foreground")}>{action}</span>}
          </span>
        </div>
        <div className="relative mt-4 h-55">
          {shade || !image ? (
            <div className={p.fill("surface", "absolute inset-0 rounded-2xl", "bg-muted")} />
          ) : (
            <img src={image} alt="" className={cn("absolute inset-0 size-full rounded-2xl object-cover ring-1 ring-black/5", layer !== "surface" && "invisible")} />
          )}
          {card && (
            <div className={p.fill("controls", "absolute -bottom-5 left-4 flex flex-col rounded-2xl px-4 py-2.5", "bg-card text-card-foreground shadow-lg ring-1 ring-foreground/10")}>
              <span className="text-sm leading-tight font-medium">{card.title}</span>
              <span className={cn("text-sm leading-tight", !shade && "text-muted-foreground")}>{card.detail}</span>
            </div>
          )}
        </div>
        <p className={p.ink("text", "mt-10 text-3xl leading-[1.1] font-medium tracking-tight text-balance")}>{heading}</p>
        {description && <p className={p.ink("text", "mt-3 text-base leading-relaxed", "text-muted-foreground")}>{description}</p>}
        {buttons.length > 0 && (
          <div className="mt-6 flex gap-2">
            {buttons.map((label, index) => (
              <span
                key={index}
                className={p.fill("controls", "inline-flex h-11 items-center rounded-full px-5 text-base whitespace-nowrap", index === 0 ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground ring-1 ring-inset ring-border")}
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const levels: Layer[] = ["surface", "text", "controls"];
  const lift = (level: number, delay: number) => ({ "--browser51-z": `${gap * level}px`, animationDelay: `${delay}s` }) as CSSProperties;
  // A layer's shadow lies on the ground sheet: the higher the layer, the further it falls and the softer it gets
  const cast = (level: number): CSSProperties => ({
    transform: `translate3d(${gap * level * 0.06}px, ${gap * level * 0.2}px, 1px)`,
    filter: `blur(${3 + level * 3}px)`,
    opacity: 0.26 - level * 0.04,
  });

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <div aria-hidden="true" className="relative h-96 w-96 shrink-0 select-none">
        <div className="absolute top-1/2 left-1/2 w-110 -translate-x-1/2 -translate-y-1/2 scale-[0.6]">
          <div style={{ perspective: "2600px" }}>
            <div
              style={{ transformStyle: "preserve-3d", transform: `rotateX(58deg) rotateZ(-38deg) translateZ(${-gap * 2}px)` }}
              className={cn("relative", animated && "browser51-live")}
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
                <div key={layer} style={lift(index + 1, index * -1.3)} className="browser51-layer absolute inset-0 text-card-foreground">
                  {scene(layer)}
                </div>
              ))}
              {/* A pane of glass on top */}
              <div
                style={{ ...lift(4, -3.9), background: "linear-gradient(125deg, rgb(255 255 255 / 0.3), rgb(255 255 255 / 0.05) 36%, rgb(255 255 255 / 0) 62%)" }}
                className="browser51-layer absolute inset-0 rounded-3xl border border-white/70 shadow-[0_0_0_1px_rgb(20_24_40/0.07)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
