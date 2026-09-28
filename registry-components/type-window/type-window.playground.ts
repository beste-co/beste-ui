/**
 * Playground for `type-window`: the word, the flight and the photo.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "word", label: "Word", kind: "text", default: "Horizon", group: "Word" },
    { prop: "surface", label: "Surface", kind: "segmented", options: ["background", "foreground"], default: "background", group: "Word" },
    { prop: "fontWeight", label: "Weight", kind: "slider", min: 400, max: 900, step: 100, default: 800, group: "Word" },
    { prop: "tracking", label: "Tracking", kind: "slider", min: -0.1, max: 0.1, step: 0.01, default: -0.04, unit: "em", group: "Word" },
    { prop: "fit", label: "Fit", kind: "slider", min: 0.4, max: 1, step: 0.02, default: 0.9, group: "Word" },
    { prop: "letter", label: "Letter", kind: "stepper", min: 0, max: 20, step: 1, default: 3, group: "Flight" },
    { prop: "progress", label: "Progress (autoplay off)", kind: "slider", min: 0, max: 1, step: 0.01, default: 0, group: "Flight" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Flight" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.25, max: 3, step: 0.05, default: 1, group: "Flight" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Flight" },
    { prop: "depth", label: "Depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Photo" },
    { prop: "interactive", label: "Pointer drift", kind: "switch", default: true, group: "Photo" },
  ],
};
