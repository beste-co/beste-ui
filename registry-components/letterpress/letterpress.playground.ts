/**
 * Playground for `letterpress`: the paper, the ink and the rhythm of the press.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "paperColor", label: "Paper", kind: "color", default: "#f1ece1", group: "Color" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Color" },
    { prop: "depth", label: "Depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Impression" },
    { prop: "coverage", label: "Ink coverage", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.9, group: "Impression" },
    { prop: "irregularity", label: "Uneven ink", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Impression" },
    { prop: "interval", label: "Between presses", kind: "stepper", min: 0.3, max: 3, step: 0.1, default: 0.6, unit: "s", group: "Rhythm" },
    { prop: "hold", label: "Rest", kind: "stepper", min: 0.5, max: 10, step: 0.5, default: 4, unit: "s", group: "Rhythm" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Rhythm" },
    { prop: "interactive", label: "Light follows cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
