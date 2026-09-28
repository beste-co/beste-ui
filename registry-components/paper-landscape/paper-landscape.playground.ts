/**
 * Playground for `paper-landscape`: the paper, the sky and the depth.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "paperColor", label: "Paper", kind: "color", default: "#f6ead6", group: "Color" },
    { prop: "sunColor", label: "Sun", kind: "color", default: "#f19a64", group: "Color" },
    { prop: "cloudColor", label: "Clouds", kind: "color", default: "#fdf7ec", group: "Color" },
    { prop: "sun", label: "Sun", kind: "switch", default: true, group: "Sky" },
    { prop: "clouds", label: "Clouds", kind: "switch", default: true, group: "Sky" },
    { prop: "birds", label: "Birds", kind: "stepper", min: 0, max: 5, step: 1, default: 5, group: "Sky" },
    { prop: "trees", label: "Trees", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Land" },
    { prop: "mist", label: "Mist", kind: "switch", default: true, group: "Land" },
    { prop: "parallax", label: "Parallax", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
  ],
};
