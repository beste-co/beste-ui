/**
 * Playground for `crt-screen`: the glass, the picture and the tuning.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "curvature", label: "Curvature", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Glass" },
    { prop: "bezel", label: "Housing", kind: "switch", default: true, group: "Glass" },
    { prop: "scanlines", label: "Scanlines", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Picture" },
    { prop: "mask", label: "Grille", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Picture" },
    { prop: "glow", label: "Glow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Picture" },
    { prop: "noise", label: "Static", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Picture" },
    { prop: "roll", label: "Hum bar", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Picture" },
    { prop: "glitchInterval", label: "Switch every", kind: "stepper", min: 0, max: 20, step: 0.5, default: 6.5, unit: "s", group: "Tuning" },
    { prop: "clickToTune", label: "Click to tune", kind: "switch", default: true, group: "Tuning" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Tuning" },
  ],
};
