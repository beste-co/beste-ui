/**
 * Playground for `reeded-light`: the light behind the glass and the reeds in front of it.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "groundColor", label: "Ground", kind: "color", default: "#07080f", group: "Color" },
    { prop: "glowColor", label: "Glow", kind: "color", default: "#f2dccb", group: "Color" },
    { prop: "hazeColor", label: "Haze", kind: "color", default: "#34397e", group: "Color" },
    { prop: "accentColor", label: "Band", kind: "color", default: "#e2457a", group: "Color" },
    { prop: "angle", label: "Direction", kind: "slider", min: 0, max: 360, step: 1, default: 35, unit: "°", group: "Light" },
    { prop: "band", label: "Band position", kind: "slider", min: 0.3, max: 0.95, step: 0.01, default: 0.66, group: "Light" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Light" },
    { prop: "reedWidth", label: "Reed width", kind: "slider", min: 12, max: 80, step: 1, default: 34, unit: "px", group: "Glass" },
    { prop: "magnify", label: "Magnify", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Glass" },
    { prop: "ripple", label: "Ripple", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Glass" },
    { prop: "shading", label: "Shading", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Glass" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Glass" },
    { prop: "veil", label: "Veil", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.25, group: "Readability" },
    { prop: "veilX", label: "Veil x", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.5, group: "Readability" },
    { prop: "veilY", label: "Veil y", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.5, group: "Readability" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "lamp", label: "Lamp", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Cursor" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Cursor" },
  ],
};
