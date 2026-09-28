/**
 * Playground for `bokeh-gradient`: the lights, the lens and the ground behind them.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "colors.0", label: "Color 1", kind: "color", group: "Colors" },
    { prop: "colors.1", label: "Color 2", kind: "color", group: "Colors" },
    { prop: "colors.2", label: "Color 3", kind: "color", group: "Colors" },
    { prop: "colors.3", label: "Color 4", kind: "color", group: "Colors" },
    { prop: "colors.4", label: "Color 5", kind: "color", group: "Colors" },
    { prop: "colors.5", label: "Color 6", kind: "color", group: "Colors" },
    { prop: "backgroundColor", label: "Background", kind: "color", default: "#0b0a14", group: "Colors" },
    { prop: "wash", label: "Wash", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Colors" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Colors" },
    { prop: "count", label: "Lights", kind: "stepper", min: 4, max: 40, step: 1, default: 24, group: "Lights" },
    { prop: "size", label: "Size", kind: "slider", min: 0.5, max: 2, step: 0.05, default: 1, unit: "x", group: "Lights" },
    { prop: "brightness", label: "Brightness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Lights" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 4, group: "Lights" },
    { prop: "focus", label: "Focus", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Lens" },
    { prop: "aperture", label: "Aperture", kind: "slider", min: 0, max: 1, step: 0.05, default: 0, group: "Lens" },
    { prop: "blades", label: "Blades", kind: "stepper", min: 5, max: 9, step: 1, default: 6, group: "Lens" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "depth", label: "Depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
