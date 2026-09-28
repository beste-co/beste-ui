/**
 * Playground for `text-orbit`: the turn, the lean and the finish.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "color", label: "Ring color", kind: "color", default: "currentColor", group: "Look" },
    { prop: "imageScale", label: "Photo zoom", kind: "slider", min: 1, max: 2.5, step: 0.05, default: 1.7, group: "Look" },
    { prop: "reflection", label: "Reflection", kind: "switch", default: true, group: "Look" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "sway", label: "Sway", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "tilt", label: "Lean", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
