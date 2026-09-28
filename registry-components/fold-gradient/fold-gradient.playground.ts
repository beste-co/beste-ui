/**
 * Playground for `fold-gradient`: the printed colors, the pleats and the light on them.
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
    { prop: "baseColor", label: "Base", kind: "color", default: "#f2ede4", group: "Colors" },
    { prop: "gradientAngle", label: "Gradient angle", kind: "slider", min: 0, max: 360, step: 5, default: 20, unit: "°", group: "Colors" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Colors" },
    { prop: "folds", label: "Folds", kind: "stepper", min: 4, max: 40, step: 1, default: 14, group: "Pleats" },
    { prop: "depth", label: "Depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.55, group: "Pleats" },
    { prop: "angle", label: "Pleat angle", kind: "slider", min: 0, max: 180, step: 5, default: 90, unit: "°", group: "Pleats" },
    { prop: "lightAngle", label: "Light angle", kind: "slider", min: 0, max: 360, step: 5, default: 135, unit: "°", group: "Pleats" },
    { prop: "sheen", label: "Sheen", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Pleats" },
    { prop: "breathe", label: "Breathe", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Motion" },
    { prop: "wave", label: "Sway", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.3, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 2, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
