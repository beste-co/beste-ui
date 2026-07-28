"use client";

import { type CSSProperties, useState } from "react";

/**
 * Interactive theming demo for the shadcn-theme post. Drag the OKLCH channels
 * and the radius, and watch a whole miniature design system re-theme from a
 * handful of CSS variables. Everything is scoped to the preview container via
 * inline custom properties, so nothing leaks onto the page.
 */

function oklch(l: number, c: number, h: number) {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${Math.round(h)})`;
}

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
};

function Slider({ label, value, min, max, step, onChange, display }: SliderProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between text-sm font-medium text-foreground">
        {label}
        <span className="font-mono text-sm tabular-nums text-muted-foreground">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--pg-primary)]"
      />
    </label>
  );
}

export function ThemePlayground() {
  const [lightness, setLightness] = useState(0.55);
  const [chroma, setChroma] = useState(0.18);
  const [hue, setHue] = useState(255);
  const [radius, setRadius] = useState(0.625);

  const primary = oklch(lightness, chroma, hue);
  // Foreground auto-contrasts against the surface: dark ink on light primaries,
  // near-white on dark ones. One rule, every hue.
  const primaryForeground = lightness > 0.62 ? "oklch(0.205 0 0)" : "oklch(0.985 0 0)";
  const ring = oklch(Math.min(lightness + 0.05, 0.98), chroma, hue);

  const style = {
    "--pg-primary": primary,
    "--pg-primary-foreground": primaryForeground,
    "--pg-ring": ring,
    "--pg-radius": `${radius}rem`,
  } as CSSProperties;

  return (
    <div className="my-8 grid gap-5 rounded-xl border bg-card p-5 md:grid-cols-2 md:p-6" style={style}>
      {/* Controls */}
      <div className="flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-4">
          <Slider
            label="Lightness (L)"
            value={lightness}
            min={0.2}
            max={0.95}
            step={0.005}
            onChange={setLightness}
            display={lightness.toFixed(3)}
          />
          <Slider
            label="Chroma (C)"
            value={chroma}
            min={0}
            max={0.37}
            step={0.005}
            onChange={setChroma}
            display={chroma.toFixed(3)}
          />
          <Slider
            label="Hue (H)"
            value={hue}
            min={0}
            max={360}
            step={1}
            onChange={setHue}
            display={`${Math.round(hue)}deg`}
          />
          <Slider
            label="Radius"
            value={radius}
            min={0}
            max={1.5}
            step={0.025}
            onChange={setRadius}
            display={`${radius.toFixed(3)}rem`}
          />
        </div>

        <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-3 font-mono text-sm leading-6 text-foreground">
          <span className="text-muted-foreground">:root </span>
          {"{"}
          {"\n  "}
          <span className="text-muted-foreground">--primary:</span> {primary};
          {"\n  "}
          <span className="text-muted-foreground">--radius:</span> {radius.toFixed(3)}rem;
          {"\n"}
          {"}"}
        </pre>
      </div>

      {/* Live preview, themed entirely by the variables above */}
      <div
        className="flex flex-col gap-4 border bg-background p-5"
        style={{ borderRadius: "var(--pg-radius)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Preview</span>
          <span
            className="px-2.5 py-0.5 text-sm font-semibold"
            style={{
              background: "var(--pg-primary)",
              color: "var(--pg-primary-foreground)",
              borderRadius: "calc(var(--pg-radius) * 2)",
            }}
          >
            New
          </span>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-foreground">Upgrade your workspace</h4>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Every accent here reads from a single token. Move a slider, the whole surface follows.
          </p>
        </div>

        <input
          placeholder="you@example.com"
          className="w-full border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2"
          style={
            {
              borderRadius: "var(--pg-radius)",
              "--tw-ring-color": "var(--pg-ring)",
            } as CSSProperties
          }
        />

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            className="cursor-pointer px-4 py-2 text-sm font-semibold transition-transform active:scale-[0.98]"
            style={{
              background: "var(--pg-primary)",
              color: "var(--pg-primary-foreground)",
              borderRadius: "var(--pg-radius)",
            }}
          >
            Get started
          </button>
          <button
            type="button"
            className="cursor-pointer border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            style={{ borderRadius: "var(--pg-radius)" }}
          >
            Learn more
          </button>
        </div>

        <div className="mt-1 flex items-center gap-2">
          {[0.9, 0.75, 0.55, 0.4, 0.28].map((l) => (
            <span
              key={l}
              className="size-7 border"
              style={{
                background: oklch(l, chroma * (l > 0.85 ? 0.4 : 1), hue),
                borderRadius: "calc(var(--pg-radius) * 0.6)",
              }}
              title={oklch(l, chroma, hue)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
