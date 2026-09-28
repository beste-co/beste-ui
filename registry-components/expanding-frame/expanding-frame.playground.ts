/**
 * Playground for `expanding-frame`: the headline, the photograph and how the frame opens.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    {
      prop: "imageSrc",
      label: "Image",
      kind: "text",
      default: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=2000&q=80",
      group: "Image",
    },
    { prop: "startWidth", label: "Start width", kind: "slider", min: 0.15, max: 0.6, step: 0.01, default: 0.3, group: "Frame" },
    { prop: "radius", label: "Corner radius", kind: "slider", min: 0, max: 64, step: 1, default: 28, group: "Frame" },
    { prop: "zoom", label: "Start zoom", kind: "slider", min: 1, max: 1.8, step: 0.05, default: 1.3, group: "Frame" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Motion" },
    { prop: "progress", label: "Progress (autoplay off)", kind: "slider", min: 0, max: 1, step: 0.01, default: 0, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.2, max: 2, step: 0.05, default: 1, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
  ],
};
