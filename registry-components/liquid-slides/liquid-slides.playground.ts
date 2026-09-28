/**
 * Playground for `liquid-slides`: timing, the wipe and the controls.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "interval", label: "Per slide", kind: "stepper", min: 2, max: 15, step: 0.5, default: 6, unit: "s", group: "Timing" },
    { prop: "transition", label: "Wipe", kind: "stepper", min: 0.4, max: 4, step: 0.1, default: 1.5, unit: "s", group: "Timing" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Timing" },
    { prop: "pauseOnHover", label: "Pause on hover", kind: "switch", default: true, group: "Timing" },
    { prop: "distortion", label: "Distortion", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Wipe" },
    { prop: "noiseScale", label: "Edge detail", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Wipe" },
    { prop: "colorSplit", label: "Color split", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Wipe" },
    { prop: "zoom", label: "Push-in", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Wipe" },
    { prop: "progress", label: "Timeline", kind: "switch", default: true, group: "Controls" },
    { prop: "arrows", label: "Arrows", kind: "switch", default: true, group: "Controls" },
    { prop: "interactive", label: "Cursor ripple", kind: "switch", default: true, group: "Controls" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Controls" },
  ],
};
