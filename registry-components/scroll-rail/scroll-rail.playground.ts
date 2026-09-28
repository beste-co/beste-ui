/**
 * Playground for `scroll-rail`: spacing and how the rail travels.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "gap", label: "Gap", kind: "slider", min: 0, max: 160, step: 4, default: 48, group: "Rail" },
    { prop: "align", label: "Align", kind: "select", options: ["start", "center", "end", "stretch"], default: "center", group: "Rail" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Motion" },
    { prop: "progress", label: "Progress (autoplay off)", kind: "slider", min: 0, max: 1, step: 0.01, default: 0, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.2, max: 3, step: 0.05, default: 1, group: "Motion" },
    { prop: "smoothing", label: "Smoothing", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
  ],
};
