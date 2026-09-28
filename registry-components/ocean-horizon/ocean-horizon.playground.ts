/**
 * Playground for `ocean-horizon`: the sky, the sun and the sea under it.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "skyTop", label: "Sky", kind: "color", default: "#1b2544", group: "Color" },
    { prop: "skyHorizon", label: "Horizon", kind: "color", default: "#e39a74", group: "Color" },
    { prop: "sunColor", label: "Sun", kind: "color", default: "#ffd29a", group: "Color" },
    { prop: "waterColor", label: "Water", kind: "color", default: "#0a2130", group: "Color" },
    { prop: "sunHeight", label: "Sun height", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.16, group: "Sun" },
    { prop: "sunX", label: "Sun position", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.62, group: "Sun" },
    { prop: "glitter", label: "Glitter", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Sun" },
    { prop: "waves", label: "Swell", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Sea" },
    { prop: "choppiness", label: "Crests", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Sea" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Sea" },
    { prop: "haze", label: "Haze", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.45, group: "Air" },
    { prop: "clouds", label: "Clouds", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Air" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Cursor" },
  ],
};
