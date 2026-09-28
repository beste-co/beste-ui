/**
 * Playground for `rain-glass`: the view, the mist and the rain.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "blur", label: "Out of focus", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "View" },
    { prop: "refraction", label: "Refraction", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "View" },
    { prop: "fog", label: "Mist", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Mist" },
    { prop: "tintColor", label: "Mist tint", kind: "color", default: "#a9b8c9", group: "Mist" },
    { prop: "recovery", label: "Mists over", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Mist" },
    { prop: "density", label: "Droplets", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Rain" },
    { prop: "rate", label: "Running drops", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Rain" },
    { prop: "dropSize", label: "Drop size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Rain" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Rain" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "wipe", label: "Wipe the mist", kind: "switch", default: true, group: "Cursor" },
  ],
};
