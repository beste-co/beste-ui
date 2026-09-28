/**
 * Playground for `harmonograph`: the ink, the pendulums and the plate.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "lineOpacity", label: "Ink strength", kind: "slider", min: 0.05, max: 1, step: 0.05, default: 0.5, group: "Color" },
    { prop: "lineWidth", label: "Line width", kind: "slider", min: 0.3, max: 3, step: 0.1, default: 0.7, unit: "px", group: "Line" },
    { prop: "damping", label: "Damping", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Line" },
    { prop: "spin", label: "Table spin", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Line" },
    { prop: "complexity", label: "Complexity", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Line" },
    { prop: "duration", label: "Per figure", kind: "slider", min: 3, max: 30, step: 1, default: 12, unit: "s", group: "Motion" },
    { prop: "hold", label: "Rest", kind: "slider", min: 0, max: 4, step: 0.1, default: 0.8, unit: "s", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "tilt", label: "Tilt", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Plate" },
    { prop: "round", label: "Round plate", kind: "switch", default: true, group: "Plate" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Plate" },
  ],
};
