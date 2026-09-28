/**
 * Playground for `ridgelines`: the plot's ink, its ridges and the cursor lift.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "lines", label: "Lines", kind: "slider", min: 12, max: 96, step: 1, default: 56, group: "Plot" },
    { prop: "amplitude", label: "Ridge height", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Plot" },
    { prop: "spread", label: "Band width", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Plot" },
    { prop: "weight", label: "Line weight", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Plot" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "riseIn", label: "Rise in", kind: "switch", default: true, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "peak", label: "Lift", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
