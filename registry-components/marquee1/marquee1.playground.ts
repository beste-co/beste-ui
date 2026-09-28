/**
 * Playground for `marquee1`: the band's look and how it answers the scroll.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "tone", label: "Tone", kind: "segmented", options: ["primary", "dark", "light", "outline"], default: "primary", group: "Look" },
    { prop: "size", label: "Size", kind: "segmented", options: ["sm", "md", "lg"], default: "md", group: "Look" },
    { prop: "separator", label: "Separator", kind: "segmented", options: ["diamond", "dot", "slash", "none"], default: "diamond", group: "Look" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 4, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "boost", label: "Scroll boost", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "followScroll", label: "Follow scroll", kind: "switch", default: true, group: "Motion" },
    { prop: "reverse", label: "Reverse", kind: "switch", default: false, group: "Motion" },
    { prop: "pauseOnHover", label: "Pause on hover", kind: "switch", default: false, group: "Motion" },
  ],
};
