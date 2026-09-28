/**
 * Playground for `warp-field`: the stars, the warp and the vanishing point.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "spaceColor", label: "Space", kind: "color", default: "#04050a", group: "Color" },
    { prop: "starColor", label: "Near stars", kind: "color", default: "#ffffff", group: "Color" },
    { prop: "midColor", label: "Mid stars", kind: "color", default: "#c9d5ff", group: "Color" },
    { prop: "farColor", label: "Far stars", kind: "color", default: "#6f82b8", group: "Color" },
    { prop: "glowColor", label: "Glow", kind: "color", default: "#96afff", group: "Color" },
    { prop: "density", label: "Density", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Stars" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Stars" },
    { prop: "horizon", label: "Horizon", kind: "slider", min: 0.1, max: 0.9, step: 0.01, default: 0.42, group: "Stars" },
    { prop: "warp", label: "Warp", kind: "slider", min: 0, max: 1, step: 0.05, default: 0, group: "Warp" },
    { prop: "streaks", label: "Streaks", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Warp" },
    { prop: "glow", label: "Glow strength", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.9, group: "Warp" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "follow", label: "Follow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Cursor" },
  ],
};
