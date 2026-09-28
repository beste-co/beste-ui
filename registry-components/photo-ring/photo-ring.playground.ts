/**
 * Playground for `photo-ring`: the ring's shape, its light and how it turns.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "gap", label: "Gap", kind: "slider", min: 0, max: 0.6, step: 0.01, default: 0.2, group: "Ring" },
    { prop: "panelWidth", label: "Panel width", kind: "slider", min: 0.1, max: 0.35, step: 0.01, default: 0.18, group: "Ring" },
    { prop: "aspect", label: "Panel shape", kind: "slider", min: 0.5, max: 1.2, step: 0.05, default: 0.75, group: "Ring" },
    { prop: "tilt", label: "Tilt", kind: "slider", min: 0, max: 20, step: 1, default: 8, group: "Ring" },
    { prop: "fogColor", label: "Surface", kind: "color", default: "var(--background)", group: "Light" },
    { prop: "fog", label: "Depth fade", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Light" },
    { prop: "shading", label: "Shading", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Light" },
    { prop: "reflection", label: "Reflection", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Light" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.05, default: 1, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Drag and scroll", kind: "switch", default: true, group: "Cursor" },
  ],
};
