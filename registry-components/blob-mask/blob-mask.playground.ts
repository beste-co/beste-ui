/**
 * Playground for `blob-mask`: the shape, its motion and the outline.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "points", label: "Lobes", kind: "stepper", min: 5, max: 14, step: 1, default: 9, group: "Shape" },
    { prop: "wobble", label: "Wobble", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Shape" },
    { prop: "fillColor", label: "Fill", kind: "color", default: "#dccbb9", group: "Shape" },
    { prop: "outline", label: "Outline", kind: "switch", default: true, group: "Outline" },
    { prop: "outlineColor", label: "Outline color", kind: "color", default: "#b07a5b", group: "Outline" },
    { prop: "outlineOffset", label: "Offset", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Outline" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "bulge", label: "Swell", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
