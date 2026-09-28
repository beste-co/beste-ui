/**
 * Playground for `halftone`: the ink, the screen and the swell under the cursor.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "contrast", label: "Contrast", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Color" },
    { prop: "dotSize", label: "Dot size", kind: "slider", min: 3, max: 24, step: 1, default: 8, unit: "px", group: "Screen" },
    { prop: "angle", label: "Angle", kind: "slider", min: 0, max: 90, step: 1, default: 45, unit: "°", group: "Screen" },
    { prop: "wave", label: "Wave", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "bulge", label: "Bulge", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Cursor" },
    { prop: "bulgeSize", label: "Bulge size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
    { prop: "ripples", label: "Ripples", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Cursor" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
