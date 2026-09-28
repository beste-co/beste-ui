/**
 * Playground for `growing-tree`: the tree's shape, its colors and the weather around it.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "seed", label: "Seed", kind: "stepper", min: 1, max: 999, step: 1, default: 7, group: "Tree" },
    { prop: "complexity", label: "Complexity", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Tree" },
    { prop: "duration", label: "Growth", kind: "slider", min: 2, max: 20, step: 0.5, default: 8, unit: "s", group: "Tree" },
    { prop: "regrow", label: "Regrow after", kind: "stepper", min: 0, max: 120, step: 5, default: 40, unit: "s", group: "Tree" },
    { prop: "branchColor", label: "Branches", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "blossomColor", label: "Blossoms", kind: "color", default: "var(--primary)", group: "Color" },
    { prop: "blossoms", label: "Blossom density", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Color" },
    { prop: "fall", label: "Petal fall", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Weather" },
    { prop: "wind", label: "Wind", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Weather" },
    { prop: "sway", label: "Sway", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Weather" },
    { prop: "interactive", label: "Cursor gusts", kind: "switch", default: true, group: "Weather" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Weather" },
  ],
};
