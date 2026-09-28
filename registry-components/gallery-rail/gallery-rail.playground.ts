/**
 * Playground for `gallery-rail`: the wall, the frames and how the rail travels.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "frameHeight", label: "Frame height", kind: "slider", min: 0.3, max: 0.8, step: 0.01, default: 0.62, group: "Wall" },
    { prop: "gap", label: "Gap", kind: "slider", min: 16, max: 160, step: 4, default: 72, group: "Wall" },
    { prop: "shadow", label: "Print shadow", kind: "switch", default: true, group: "Wall" },
    { prop: "parallax", label: "Parallax", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Look" },
    { prop: "lift", label: "Lift at center", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Look" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Motion" },
    { prop: "progress", label: "Progress (autoplay off)", kind: "slider", min: 0, max: 1, step: 0.01, default: 0, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.2, max: 3, step: 0.05, default: 1, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
  ],
};
