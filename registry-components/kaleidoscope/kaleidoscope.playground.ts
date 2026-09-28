/**
 * Playground for `kaleidoscope`: the pattern, the tube and how it turns.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "segments", label: "Segments", kind: "stepper", min: 6, max: 12, step: 1, default: 8, group: "Pattern" },
    { prop: "zoom", label: "Zoom", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Pattern" },
    { prop: "drift", label: "Drift", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Pattern" },
    { prop: "round", label: "Round tube", kind: "switch", default: true, group: "Tube" },
    { prop: "rim", label: "Glass rim", kind: "switch", default: true, group: "Tube" },
    { prop: "vignette", label: "Vignette", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Tube" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
