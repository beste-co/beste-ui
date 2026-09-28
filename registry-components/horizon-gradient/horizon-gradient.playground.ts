/**
 * Playground for `horizon-gradient`: the sky, the sun and the air between them.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "colors.0", label: "Zenith", kind: "color", group: "Sky" },
    { prop: "colors.1", label: "Color 2", kind: "color", group: "Sky" },
    { prop: "colors.2", label: "Color 3", kind: "color", group: "Sky" },
    { prop: "colors.3", label: "Color 4", kind: "color", group: "Sky" },
    { prop: "colors.4", label: "Color 5", kind: "color", group: "Sky" },
    { prop: "colors.5", label: "Horizon", kind: "color", group: "Sky" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Sky" },
    { prop: "horizon", label: "Horizon", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.3, group: "Sky" },
    { prop: "sunColor", label: "Sun", kind: "color", default: "#fff1d6", group: "Sun" },
    { prop: "sunSize", label: "Size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.45, group: "Sun" },
    { prop: "sunX", label: "Position", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.5, group: "Sun" },
    { prop: "glow", label: "Glow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Sun" },
    { prop: "haze", label: "Haze", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Air" },
    { prop: "streaks", label: "Streaks", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Air" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 2, group: "Air" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    { prop: "drift", label: "Drift", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.3, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
