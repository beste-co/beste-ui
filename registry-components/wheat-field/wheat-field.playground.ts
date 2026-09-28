/**
 * Playground for `wheat-field`: the light, the field and the wind.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "skyTop", label: "Sky", kind: "color", default: "#6f87a6", group: "Light" },
    { prop: "skyHorizon", label: "Horizon", kind: "color", default: "#f3d6a8", group: "Light" },
    { prop: "sunColor", label: "Sun", kind: "color", default: "#ffd28a", group: "Light" },
    { prop: "grainColor", label: "Grain", kind: "color", default: "#d9a441", group: "Field" },
    { prop: "density", label: "Density", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Field" },
    { prop: "wind", label: "Wind", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Wind" },
    { prop: "gustSpeed", label: "Gust speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Wind" },
    { prop: "sway", label: "Sway", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Wind" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Wind" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "brush", label: "Brush", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Cursor" },
  ],
};
