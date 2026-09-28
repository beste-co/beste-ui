/**
 * Playground for `orb-gradient`: the palette, where the orb sits and how it is lit.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "colors.0", label: "Color 1", kind: "color", group: "Colors" },
    { prop: "colors.1", label: "Color 2", kind: "color", group: "Colors" },
    { prop: "colors.2", label: "Color 3", kind: "color", group: "Colors" },
    { prop: "colors.3", label: "Color 4", kind: "color", group: "Colors" },
    { prop: "colors.4", label: "Color 5", kind: "color", group: "Colors" },
    { prop: "colors.5", label: "Color 6", kind: "color", group: "Colors" },
    { prop: "baseColor", label: "Space", kind: "color", default: "#07060f", group: "Colors" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Colors" },
    { prop: "size", label: "Size", kind: "slider", min: 0.2, max: 3, step: 0.05, default: 0.8, unit: "x", group: "Orb" },
    { prop: "positionX", label: "Position X", kind: "slider", min: -0.5, max: 1.5, step: 0.01, default: 0.5, group: "Orb" },
    { prop: "positionY", label: "Position Y", kind: "slider", min: -0.5, max: 2.5, step: 0.01, default: 0.5, group: "Orb" },
    { prop: "swirl", label: "Swirl", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Orb" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 2, group: "Orb" },
    { prop: "lightAngle", label: "Light angle", kind: "slider", min: 0, max: 360, step: 5, default: 120, unit: "°", group: "Light" },
    { prop: "rim", label: "Rim", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Light" },
    { prop: "glow", label: "Glow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Light" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
