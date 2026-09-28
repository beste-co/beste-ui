/**
 * Playground for `wave-gradient`: the palette, the shape of the waves and the grain.
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
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Colors" },
    { prop: "bands", label: "Bands", kind: "stepper", min: 2, max: 9, step: 1, default: 6, group: "Waves" },
    { prop: "angle", label: "Angle", kind: "slider", min: -60, max: 60, step: 1, default: -12, unit: "°", group: "Waves" },
    { prop: "amplitude", label: "Amplitude", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.55, group: "Waves" },
    { prop: "frequency", label: "Frequency", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.45, group: "Waves" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 2, group: "Waves" },
    { prop: "softness", label: "Softness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Light" },
    { prop: "glow", label: "Glow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Light" },
    { prop: "depth", label: "Depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Light" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
