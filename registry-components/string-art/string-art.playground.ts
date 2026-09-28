/**
 * Playground for `string-art`: the board, the thread and the pace of the weaving.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "threadColor", label: "Thread", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "boardColor", label: "Board", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "needleColor", label: "Needle", kind: "color", default: "var(--primary)", group: "Color" },
    { prop: "threadOpacity", label: "Thread weight", kind: "slider", min: 0.04, max: 0.4, step: 0.01, default: 0.14, group: "Weave" },
    { prop: "pins", label: "Pins", kind: "slider", min: 120, max: 320, step: 10, default: 220, group: "Weave" },
    { prop: "lines", label: "Max passes", kind: "slider", min: 800, max: 5000, step: 100, default: 3000, group: "Weave" },
    { prop: "contrast", label: "Contrast", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Weave" },
    { prop: "rim", label: "Rim", kind: "switch", default: true, group: "Weave" },
    { prop: "speed", label: "Speed", kind: "slider", min: 40, max: 800, step: 10, default: 260, unit: "/s", group: "Motion" },
    { prop: "hold", label: "Hold", kind: "slider", min: 0, max: 12, step: 0.5, default: 4, unit: "s", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "tilt", label: "Tilt", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
