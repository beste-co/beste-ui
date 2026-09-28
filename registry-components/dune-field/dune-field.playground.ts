/**
 * Playground for `dune-field`: the colors of the scene, the sun, the dunes and the glide.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "sandColor", label: "Sand", kind: "color", default: "#d9a066", group: "Color" },
    { prop: "skyColor", label: "Sky", kind: "color", default: "#6d8fbf", group: "Color" },
    { prop: "hazeColor", label: "Haze", kind: "color", default: "#f2c9a0", group: "Color" },
    { prop: "sunColor", label: "Sun", kind: "color", default: "#ffd2a1", group: "Color" },
    { prop: "sunHeight", label: "Sun height", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.25, group: "Sun" },
    { prop: "sunAngle", label: "Sun angle", kind: "slider", min: -90, max: 90, step: 1, default: -32, group: "Sun" },
    { prop: "scale", label: "Dune size", kind: "slider", min: 0.6, max: 1.6, step: 0.05, default: 1, group: "Dunes" },
    { prop: "ripples", label: "Ripples", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Dunes" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.05, default: 1, group: "Motion" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
