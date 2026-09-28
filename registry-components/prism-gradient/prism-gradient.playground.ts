/**
 * Playground for `prism-gradient`: the colors, the beams and the prism.
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
    { prop: "spectrum", label: "Rainbow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Colors" },
    { prop: "baseColor", label: "Base", kind: "color", default: "#07060b", group: "Colors" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Colors" },
    { prop: "beams", label: "Beams", kind: "stepper", min: 1, max: 5, step: 1, default: 3, group: "Beams" },
    { prop: "spread", label: "Spread", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Beams" },
    { prop: "angle", label: "Angle", kind: "slider", min: -180, max: 180, step: 1, default: -18, unit: "°", group: "Beams" },
    { prop: "sharpness", label: "Sharpness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Beams" },
    { prop: "caustics", label: "Caustics", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Beams" },
    { prop: "whiteBeam", label: "White beam", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Beams" },
    { prop: "sourceX", label: "Prism X", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.3, group: "Prism" },
    { prop: "sourceY", label: "Prism Y", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.58, group: "Prism" },
    { prop: "bloom", label: "Bloom", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Prism" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 4, group: "Prism" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
