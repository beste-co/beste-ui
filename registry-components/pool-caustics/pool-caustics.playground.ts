/**
 * Playground for `pool-caustics`: the floor, the light and the water's motion.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "tileColor", label: "Tiles", kind: "color", default: "#d6f2f5", group: "Floor" },
    { prop: "groutColor", label: "Grout", kind: "color", default: "#abd6de", group: "Floor" },
    { prop: "laneColor", label: "Lane", kind: "color", default: "#1a4a78", group: "Floor" },
    { prop: "tileSize", label: "Tiles", kind: "slider", min: 6, max: 32, step: 1, default: 16, group: "Floor" },
    { prop: "lane", label: "Lane mark", kind: "switch", default: true, group: "Floor" },
    { prop: "waterColor", label: "Water", kind: "color", default: "#8cd6e0", group: "Water" },
    { prop: "tint", label: "Tint", kind: "slider", min: 0, max: 1, step: 0.02, default: 0.24, group: "Water" },
    { prop: "refraction", label: "Refraction", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Water" },
    { prop: "lightColor", label: "Light", kind: "color", default: "#fffaeb", group: "Light" },
    { prop: "caustics", label: "Caustics", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Light" },
    { prop: "causticScale", label: "Caustic size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Light" },
    { prop: "colorSplit", label: "Color split", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Light" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "rain", label: "Rain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "ripples", label: "Ripples", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Cursor" },
  ],
};
