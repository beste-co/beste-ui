/**
 * Playground for `slice-assembly`: the photograph, the strips and how they come together.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    {
      prop: "imageSrc",
      label: "Image",
      kind: "text",
      default: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1400&q=80",
      group: "Image",
    },
    { prop: "strips", label: "Strips", kind: "stepper", min: 3, max: 40, step: 1, default: 14, group: "Strips" },
    { prop: "depth", label: "Depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Strips" },
    { prop: "scatter", label: "Scatter", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Strips" },
    { prop: "stagger", label: "Stagger", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Strips" },
    { prop: "shading", label: "Shading", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Light" },
    { prop: "shadow", label: "Shadow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Light" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Motion" },
    { prop: "progress", label: "Progress (autoplay off)", kind: "slider", min: 0, max: 1, step: 0.01, default: 0, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.2, max: 2, step: 0.05, default: 1, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
