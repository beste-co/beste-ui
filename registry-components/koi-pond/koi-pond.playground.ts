/**
 * Playground for `koi-pond`: the fish, the water and how they answer the hand.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "fish", label: "Koi", kind: "stepper", min: 1, max: 12, step: 1, default: 7, group: "Fish" },
    { prop: "palette", label: "Varieties", kind: "segmented", options: ["mixed", "kohaku", "golden"], default: "mixed", group: "Fish" },
    { prop: "speed", label: "Pace", kind: "slider", min: 0.3, max: 2, step: 0.1, default: 1, unit: "x", group: "Fish" },
    { prop: "waterColor", label: "Water", kind: "color", default: "#173f39", group: "Water" },
    { prop: "caustics", label: "Caustics", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Water" },
    { prop: "ripples", label: "Ripples", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Water" },
    { prop: "lilyPads", label: "Lily pads", kind: "switch", default: true, group: "Water" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "curiosity", label: "Curiosity", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Cursor" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Cursor" },
  ],
};
