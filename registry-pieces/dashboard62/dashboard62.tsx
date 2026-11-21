"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Layer = "none" | "surface" | "text" | "controls";

interface Dashboard62Props {
  label?: string;
  value?: string;
  /** The change chip beside the figure, e.g. "+18%" */
  change?: string;
  /** The range pill, e.g. "30 days" */
  range?: string;
  /** Bar heights from 0 to 100; the last one takes the primary color */
  bars?: number[];
  /** Labels under the bars */
  ticks?: string[];
  /** The wash of color on the ground sheet, any CSS color */
  tint?: string;
  /** Distance between two layers, in pixels */
  gap?: number;
  /** Let the layers rise and fall slowly */
  animated?: boolean;
  className?: string;
}

export const dashboard62Demo: Dashboard62Props = {
  label: "Visitors",
  value: "12,480",
  change: "+18%",
  range: "30 days",
  bars: [34, 52, 44, 68, 58, 82, 96],
  ticks: ["Mon", "Wed", "Fri", "Sun"],
  tint: "#cfe3e0",
  gap: 42,
  animated: true,
};

const STYLES = `
@keyframes dashboard62-float { from { transform: translateZ(calc(var(--dashboard62-z) - 5px)) } to { transform: translateZ(calc(var(--dashboard62-z) + 5px)) } }
.dashboard62-layer { transform: translateZ(var(--dashboard62-z)) }
.dashboard62-live .dashboard62-layer { animation: dashboard62-float 4.5s ease-in-out infinite alternate }
@media (prefers-reduced-motion: reduce) { .dashboard62-live .dashboard62-layer { animation: none } }
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

export function Dashboard62({ label, value, change, range, bars = [], ticks = [], tint = "#cfe3e0", gap = 42, animated = true, className }: Dashboard62Props) {
  // One layout drawn once per layer, so the layers always register
  const scene = (layer: Layer, shade = false) => {
    const p = painter(layer, shade);
    return (
      <div className="flex flex-col p-5 text-left">
        <div className="flex items-center justify-between gap-3">
          <p className={p.ink("text", "text-sm", "text-muted-foreground")}>{label}</p>
          {range && <span className={p.fill("controls", "inline-flex h-7 items-center rounded-full px-3 text-sm", "bg-muted text-foreground")}>{range}</span>}
        </div>
        <div className="mt-2 flex items-center gap-2.5">
          <p className={p.ink("text", "text-4xl leading-none font-medium tracking-tighter")}>{value}</p>
          {change && <span className={p.fill("controls", "inline-flex h-6 items-center rounded-full px-2 text-sm", "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300")}>{change}</span>}
        </div>
        <div className="mt-5 flex h-32 items-end gap-2">
          {bars.map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} className={p.fill("surface", "flex-1 rounded-lg", index === bars.length - 1 ? "bg-primary" : "bg-foreground/15")} />
          ))}
        </div>
        <div className="mt-3 flex justify-between">
          {ticks.map((tick, index) => (
            <span key={index} className={p.ink("text", "text-sm", "text-muted-foreground")}>
              {tick}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const levels: Layer[] = ["surface", "text", "controls"];
  const lift = (level: number, delay: number) => ({ "--dashboard62-z": `${gap * level}px`, animationDelay: `${delay}s` }) as CSSProperties;
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
              className={cn("relative", animated && "dashboard62-live")}
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
                <div key={layer} style={lift(index + 1, index * -1.3)} className="dashboard62-layer absolute inset-0 text-card-foreground">
                  {scene(layer)}
                </div>
              ))}
              {/* A pane of glass on top */}
              <div
                style={{ ...lift(4, -3.9), background: "linear-gradient(125deg, rgb(255 255 255 / 0.3), rgb(255 255 255 / 0.05) 36%, rgb(255 255 255 / 0) 62%)" }}
                className="dashboard62-layer absolute inset-0 rounded-3xl border border-white/70 shadow-[0_0_0_1px_rgb(20_24_40/0.07)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
