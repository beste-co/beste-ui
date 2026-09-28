/**
 * Playground for `liquid-chrome`: every look and motion setting of the surface.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "shadowColor", label: "Shadow", kind: "color", default: "#09090b", group: "Color" },
    { prop: "highlightColor", label: "Highlight", kind: "color", default: "#d1d6e0", group: "Color" },
    { prop: "iridescence", label: "Iridescence", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.75, group: "Color" },
    { prop: "hue", label: "Film hue", kind: "slider", min: 0, max: 1, step: 0.01, default: 0, group: "Color" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "scale", label: "Fold size", kind: "slider", min: 0.6, max: 4, step: 0.1, default: 1.7, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "pull", label: "Pull", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.45, group: "Cursor" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Finish" },
    { prop: "vignette", label: "Vignette", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.55, group: "Finish" },
  ],
};
