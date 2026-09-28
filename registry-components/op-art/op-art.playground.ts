/**
 * Playground for `op-art`: the colors, the line field and its motion.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "lines", label: "Lines", kind: "slider", min: 8, max: 90, step: 1, default: 34, group: "Field" },
    { prop: "angle", label: "Angle", kind: "slider", min: -90, max: 90, step: 1, default: 0, unit: "°", group: "Field" },
    { prop: "weight", label: "Weight", kind: "slider", min: 0.05, max: 0.95, step: 0.01, default: 0.1, group: "Field" },
    { prop: "contrast", label: "Contrast", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Field" },
    { prop: "wave", label: "Wave", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "pull", label: "Pull", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
