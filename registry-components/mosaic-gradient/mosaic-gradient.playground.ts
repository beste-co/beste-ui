/**
 * Playground for `mosaic-gradient`: the palette, the tiles and the light passing over them.
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
    { prop: "backgroundColor", label: "Grout", kind: "color", default: "#12100e", group: "Colors" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Colors" },
    { prop: "cells", label: "Tiles across", kind: "slider", min: 4, max: 80, step: 1, default: 24, group: "Tiles" },
    { prop: "gap", label: "Gap", kind: "slider", min: 0, max: 0.5, step: 0.01, default: 0.14, group: "Tiles" },
    { prop: "radius", label: "Rounding", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Tiles" },
    { prop: "depth", label: "Depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Tiles" },
    { prop: "shimmer", label: "Shimmer", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Tiles" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 3, group: "Tiles" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    { prop: "wave", label: "Waves", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
