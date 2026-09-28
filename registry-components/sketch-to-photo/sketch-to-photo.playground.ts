/**
 * Playground for `sketch-to-photo`: the paper, the pen and where the piece is between drawing and photo.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "paperColor", label: "Paper", kind: "color", default: "#f1ece2", group: "Color" },
    { prop: "inkColor", label: "Ink", kind: "color", default: "#2b2723", group: "Color" },
    { prop: "lineWeight", label: "Line weight", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Drawing" },
    { prop: "lineDetail", label: "Line detail", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Drawing" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Drawing" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Motion" },
    { prop: "progress", label: "Progress", kind: "slider", min: 0, max: 1, step: 0.01, default: 1, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
  ],
};
