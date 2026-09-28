/**
 * Playground for `star-trails`: the sky, the exposure and the land below it.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "skyColor", label: "Sky", kind: "color", default: "#03050b", group: "Color" },
    { prop: "glowColor", label: "Airglow", kind: "color", default: "#10292f", group: "Color" },
    { prop: "horizonColor", label: "Horizon", kind: "color", default: "#b0643a", group: "Color" },
    { prop: "landColor", label: "Land", kind: "color", default: "#010203", group: "Color" },
    { prop: "stars", label: "Stars", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Sky" },
    { prop: "exposure", label: "Exposure", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Sky" },
    { prop: "poleX", label: "Pole x", kind: "slider", min: -0.5, max: 1.5, step: 0.01, default: 0.64, group: "Sky" },
    { prop: "poleY", label: "Pole y", kind: "slider", min: -1, max: 0.8, step: 0.01, default: -0.14, group: "Sky" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Sky" },
    { prop: "silhouette", label: "Foreground", kind: "segmented", options: ["forest", "ridges", "none"], default: "forest", group: "Land" },
    { prop: "horizon", label: "Horizon", kind: "slider", min: 0.08, max: 0.5, step: 0.01, default: 0.24, group: "Land" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Land" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Cursor" },
  ],
};
