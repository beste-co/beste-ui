/**
 * Playground for `cyanotype`: the chemistry, the specimens and the timing of each print.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "blueColor", label: "Blue", kind: "color", default: "#1c3f6e", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "#f3eee2", group: "Color" },
    { prop: "chemistryColor", label: "Coating", kind: "color", default: "#dcd6a2", group: "Color" },
    { prop: "specimens", label: "Specimens", kind: "slider", min: 1, max: 9, step: 1, default: 5, group: "Print" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 1, max: 999, step: 1, default: 11, group: "Print" },
    { prop: "focus", label: "Focus", kind: "segmented", options: ["right", "center", "full"], default: "right", group: "Print" },
    { prop: "brushEdge", label: "Brushed edge", kind: "switch", default: true, group: "Print" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Print" },
    { prop: "exposureTime", label: "Exposure", kind: "slider", min: 2, max: 20, step: 0.5, default: 6, unit: "s", group: "Timing" },
    { prop: "washInterval", label: "Wash every", kind: "slider", min: 0, max: 40, step: 1, default: 12, unit: "s", group: "Timing" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Timing" },
    { prop: "interactive", label: "Cursor shade", kind: "switch", default: true, group: "Cursor" },
    { prop: "shade", label: "Shade", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Cursor" },
  ],
};
