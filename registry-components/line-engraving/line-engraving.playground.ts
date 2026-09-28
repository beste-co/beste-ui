/**
 * Playground for `line-engraving`: the ink, the paper, the cut of the lines and the loupe.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "#18222f", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "#f3eee3", group: "Color" },
    { prop: "density", label: "Density", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.55, group: "Lines" },
    { prop: "angle", label: "Angle", kind: "slider", min: -90, max: 90, step: 1, default: 28, unit: "°", group: "Lines" },
    { prop: "contour", label: "Contour", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Lines" },
    { prop: "crossHatch", label: "Cross hatch", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Lines" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Paper" },
    { prop: "plateMark", label: "Plate mark", kind: "switch", default: true, group: "Paper" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Loupe follows cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "loupe", label: "Loupe", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Cursor" },
  ],
};
