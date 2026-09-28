/**
 * Playground for `photo-dust`: the dust, the wind and the settle.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Motion" },
    { prop: "progress", label: "Progress (autoplay off)", kind: "slider", min: 0, max: 1, step: 0.01, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.2, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "density", label: "Density", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Dust" },
    { prop: "wind", label: "Wind", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Dust" },
    { prop: "grain", label: "Film grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Dust" },
    { prop: "groundColor", label: "Ground", kind: "color", default: "#0e0c0a", group: "Color" },
    { prop: "focusX", label: "Focus x", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.4, group: "Crop" },
    { prop: "focusY", label: "Focus y", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.5, group: "Crop" },
    { prop: "interactive", label: "Cursor blows the dust", kind: "switch", default: true, group: "Cursor" },
  ],
};
