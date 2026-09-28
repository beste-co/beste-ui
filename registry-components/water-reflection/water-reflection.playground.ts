/**
 * Playground for `water-reflection`: the waterline, the water and its motion.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "horizon", label: "Waterline", kind: "slider", min: 0.15, max: 0.8, step: 0.01, default: 0.42, group: "Scene" },
    { prop: "crop", label: "Crop", kind: "slider", min: 0, max: 0.6, step: 0.01, default: 0.12, group: "Scene" },
    { prop: "waterColor", label: "Water", kind: "color", default: "#070b14", group: "Water" },
    { prop: "reflectivity", label: "Reflection", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.85, group: "Water" },
    { prop: "glints", label: "Glints", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Water" },
    { prop: "waves", label: "Swell", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "rain", label: "Rain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "ripples", label: "Ripples", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Cursor" },
  ],
};
