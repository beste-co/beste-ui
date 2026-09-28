/**
 * Playground for `fluid-gradient`: the color ramp, the shape of the pour and the grain.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "colors.0", label: "Stop 1", kind: "color", group: "Ramp" },
    { prop: "colors.1", label: "Stop 2", kind: "color", group: "Ramp" },
    { prop: "colors.2", label: "Stop 3", kind: "color", group: "Ramp" },
    { prop: "colors.3", label: "Stop 4", kind: "color", group: "Ramp" },
    { prop: "colors.4", label: "Stop 5", kind: "color", group: "Ramp" },
    { prop: "colors.5", label: "Stop 6", kind: "color", group: "Ramp" },
    { prop: "repeat", label: "Repeat", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "x", group: "Ramp" },
    { prop: "contrast", label: "Contrast", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Ramp" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Ramp" },
    { prop: "scale", label: "Scale", kind: "slider", min: 0.5, max: 2.5, step: 0.05, default: 1, unit: "x", group: "Pour" },
    { prop: "warp", label: "Warp", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Pour" },
    { prop: "detail", label: "Detail", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Pour" },
    { prop: "flow", label: "Flow", kind: "slider", min: 0, max: 360, step: 5, default: 20, unit: "°", group: "Pour" },
    { prop: "stretch", label: "Stretch", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.3, group: "Pour" },
    { prop: "sheen", label: "Sheen", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Pour" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 2, group: "Pour" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "pull", label: "Pull", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
