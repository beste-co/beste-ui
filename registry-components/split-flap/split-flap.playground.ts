/**
 * Playground for `split-flap`: the board's size, timing and colors.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "columns", label: "Columns", kind: "stepper", min: 4, max: 24, step: 1, default: 15, group: "Board" },
    { prop: "rows", label: "Rows", kind: "stepper", min: 1, max: 6, step: 1, default: 4, group: "Board" },
    { prop: "uppercase", label: "Capitals", kind: "switch", default: true, group: "Board" },
    { prop: "interval", label: "Per phrase", kind: "slider", min: 1500, max: 10000, step: 100, default: 5200, unit: "ms", group: "Timing" },
    { prop: "flips", label: "Flips", kind: "stepper", min: 0, max: 8, step: 1, default: 5, group: "Timing" },
    { prop: "stagger", label: "Ripple", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Timing" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Timing" },
    { prop: "flapColor", label: "Flaps", kind: "color", default: "#262624", group: "Color" },
    { prop: "inkColor", label: "Ink", kind: "color", default: "#f3ede1", group: "Color" },
    { prop: "splitColor", label: "Split", kind: "color", default: "#0b0b0a", group: "Color" },
  ],
};
