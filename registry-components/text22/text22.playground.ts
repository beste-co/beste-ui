/**
 * Playground for `text22`: the board's slats and how it turns.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "div"], default: "div" },
    { prop: "slats", label: "Slats", kind: "slider", min: 4, max: 48, step: 1, default: 18, group: "Board" },
    { prop: "seams", label: "Seams", kind: "switch", default: true, group: "Board" },
    { prop: "shading", label: "Shading", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Board" },
    { prop: "interval", label: "Hold", kind: "stepper", min: 1, max: 8, step: 0.2, default: 3.2, unit: "s", group: "Turn" },
    { prop: "turn", label: "Turn", kind: "stepper", min: 0.3, max: 2, step: 0.1, default: 0.9, unit: "s", group: "Turn" },
    { prop: "stagger", label: "Wave", kind: "stepper", min: 0, max: 0.15, step: 0.005, default: 0.035, unit: "s", group: "Turn" },
    { prop: "pauseOnHover", label: "Pause on hover", kind: "switch", default: true, group: "Turn" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Turn" },
  ],
};
