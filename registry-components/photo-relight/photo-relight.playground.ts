/**
 * Playground for `photo-relight`: the hour, the grade and the lights.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "progress", label: "Time of day", kind: "slider", min: 0, max: 1, step: 0.01, group: "Day" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Day" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.2, max: 3, step: 0.1, default: 1, unit: "x", group: "Day" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Day" },
    { prop: "warmth", label: "Golden warmth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Grade" },
    { prop: "nightDepth", label: "Night depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Grade" },
    { prop: "horizon", label: "Horizon", kind: "slider", min: 0.1, max: 0.9, step: 0.01, default: 0.5, group: "Grade" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Grade" },
    { prop: "glowColor", label: "Light color", kind: "color", default: "#ffd9a8", group: "Lights" },
    { prop: "bloom", label: "Bloom", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Lights" },
    { prop: "focusX", label: "Focus x", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.45, group: "Crop" },
    { prop: "focusY", label: "Focus y", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.5, group: "Crop" },
  ],
};
