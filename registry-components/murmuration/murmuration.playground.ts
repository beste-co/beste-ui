/**
 * Playground for `murmuration`: the sky, the flock and the hawk.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "skyTop", label: "Sky", kind: "color", default: "#353a5c", group: "Color" },
    { prop: "skyHorizon", label: "Horizon", kind: "color", default: "#e7b08a", group: "Color" },
    { prop: "birdColor", label: "Birds", kind: "color", default: "#16141c", group: "Color" },
    { prop: "birds", label: "Birds", kind: "slider", min: 200, max: 2600, step: 100, default: 1800, group: "Flock" },
    { prop: "birdSize", label: "Bird size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Flock" },
    { prop: "cohesion", label: "Cohesion", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Flock" },
    { prop: "alignment", label: "Alignment", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Flock" },
    { prop: "separation", label: "Separation", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Flock" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.3, max: 2, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "wander", label: "Wander", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Cursor hawk", kind: "switch", default: true, group: "Hawk" },
    { prop: "hawk", label: "Fear", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Hawk" },
    { prop: "hawkRadius", label: "Reach", kind: "slider", min: 40, max: 320, step: 10, default: 140, unit: "px", group: "Hawk" },
  ],
};
