/**
 * Playground for `smoke-gradient`: the palette, the plumes and how they move.
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
    { prop: "baseColor", label: "Base", kind: "color", default: "#0d0a10", group: "Colors" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Colors" },
    { prop: "density", label: "Density", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Smoke" },
    { prop: "plumes", label: "Plumes", kind: "stepper", min: 1, max: 5, step: 1, default: 3, group: "Smoke" },
    { prop: "height", label: "Height", kind: "slider", min: 0.2, max: 1, step: 0.05, default: 0.8, group: "Smoke" },
    { prop: "curl", label: "Curl", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Smoke" },
    { prop: "softness", label: "Softness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Smoke" },
    { prop: "scale", label: "Scale", kind: "slider", min: 0.5, max: 2, step: 0.05, default: 1, unit: "x", group: "Smoke" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 4, group: "Smoke" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    { prop: "rise", label: "Rise", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
