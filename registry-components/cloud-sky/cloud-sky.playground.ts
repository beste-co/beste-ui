/**
 * Playground for `cloud-sky`: the sky, the sun and the clouds drifting through it.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "skyTop", label: "Sky", kind: "color", default: "#5d6f96", group: "Sky" },
    { prop: "skyHorizon", label: "Horizon", kind: "color", default: "#f3c79a", group: "Sky" },
    { prop: "sunColor", label: "Sun", kind: "color", default: "#fff1d6", group: "Sky" },
    { prop: "sunX", label: "Sun across", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.72, group: "Sky" },
    { prop: "sunY", label: "Sun height", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.34, group: "Sky" },
    { prop: "coverage", label: "Coverage", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.55, group: "Clouds" },
    { prop: "softness", label: "Softness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Clouds" },
    { prop: "layers", label: "Layers", kind: "stepper", min: 1, max: 4, step: 1, default: 4, group: "Clouds" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
