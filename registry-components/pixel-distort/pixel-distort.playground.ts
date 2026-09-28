/**
 * Playground for `pixel-distort`: the grid, the drag and the finish.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "grid", label: "Grid", kind: "slider", min: 12, max: 72, step: 2, default: 36, group: "Grid" },
    { prop: "pixelate", label: "Pixelate", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Grid" },
    { prop: "strength", label: "Strength", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Drag" },
    { prop: "radius", label: "Radius", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Drag" },
    { prop: "relax", label: "Settle", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Drag" },
    { prop: "aberration", label: "Color split", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Finish" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Finish" },
    { prop: "intro", label: "Resolve on arrival", kind: "switch", default: true, group: "Finish" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Cursor" },
  ],
};
