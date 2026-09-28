/**
 * Playground for `ink-flow`: the ink, the current and the brush.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "opacity", label: "Ink strength", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Color" },
    { prop: "density", label: "Density", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Strokes" },
    { prop: "weight", label: "Weight", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Strokes" },
    { prop: "trail", label: "Trail", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Strokes" },
    { prop: "gather", label: "Gather", kind: "segmented", options: ["left", "center", "right", "none"], default: "right", group: "Strokes" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "swirl", label: "Swirl", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "brush", label: "Brush", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
