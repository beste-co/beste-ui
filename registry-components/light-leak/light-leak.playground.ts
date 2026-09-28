/**
 * Playground for `light-leak`: the light, where it gets in and the film over it.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "colors.0", label: "Leak 1", kind: "color", group: "Colors" },
    { prop: "colors.1", label: "Leak 2", kind: "color", group: "Colors" },
    { prop: "colors.2", label: "Leak 3", kind: "color", group: "Colors" },
    { prop: "colors.3", label: "Leak 4", kind: "color", group: "Colors" },
    { prop: "colors.4", label: "Leak 5", kind: "color", group: "Colors" },
    { prop: "colors.5", label: "Leak 6", kind: "color", group: "Colors" },
    { prop: "baseColor", label: "Base", kind: "color", default: "#0d0a09", group: "Colors" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Colors" },
    { prop: "leaks", label: "Leaks", kind: "stepper", min: 1, max: 6, step: 1, default: 4, group: "Light" },
    { prop: "edges", label: "Edges", kind: "select", options: ["all", "corners", "top", "bottom", "sides"], default: "all", group: "Light" },
    { prop: "size", label: "Size", kind: "slider", min: 0.4, max: 2, step: 0.05, default: 1, unit: "x", group: "Light" },
    { prop: "intensity", label: "Intensity", kind: "slider", min: 0, max: 1.5, step: 0.05, default: 1, group: "Light" },
    { prop: "burn", label: "Burn", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Light" },
    { prop: "fringe", label: "Fringe", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Light" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 2, group: "Light" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker grain", kind: "switch", default: true, group: "Grain" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "flicker", label: "Exposure flicker", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.3, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
