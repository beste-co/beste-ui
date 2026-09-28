/**
 * Playground for `curtain-reveal`: the velvet, the drape and the pace.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "imageSrc", label: "Photo", kind: "text", default: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=2400&q=80", group: "Photo" },
    { prop: "color", label: "Velvet", kind: "color", default: "#6a0d1b", group: "Color" },
    { prop: "sheenColor", label: "Sheen", kind: "color", default: "#ec6a78", group: "Color" },
    { prop: "sheen", label: "Sheen strength", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Color" },
    { prop: "folds", label: "Folds", kind: "stepper", min: 4, max: 24, step: 1, default: 12, group: "Drape" },
    { prop: "valance", label: "Swags", kind: "slider", min: 0, max: 0.25, step: 0.01, default: 0.1, group: "Drape" },
    { prop: "frame", label: "Width kept open", kind: "slider", min: 0, max: 0.2, step: 0.01, default: 0.06, group: "Drape" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Drape" },
    { prop: "progress", label: "Progress (autoplay off)", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.4, group: "Motion" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: true, group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0.2, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Cursor sway", kind: "switch", default: true, group: "Cursor" },
  ],
};
