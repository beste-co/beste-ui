/**
 * Playground for `zoom-parallax`: the collage and how it zooms into the center photograph.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "layout", label: "Layout", kind: "segmented", options: ["editorial", "headline"], default: "editorial", group: "Collage" },
    { prop: "depth", label: "Depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Collage" },
    { prop: "shadow", label: "Shadow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Collage" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Motion" },
    { prop: "progress", label: "Progress (autoplay off)", kind: "slider", min: 0, max: 1, step: 0.01, default: 0, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.2, max: 2, step: 0.05, default: 1, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
