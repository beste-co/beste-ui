/**
 * Playground for `counter-columns`: the wall's layout, its lean and how it drifts.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "columns", label: "Columns", kind: "stepper", min: 1, max: 5, step: 1, default: 3, group: "Layout" },
    { prop: "gap", label: "Gap", kind: "slider", min: 0, max: 48, step: 1, default: 16, group: "Layout" },
    { prop: "fade", label: "Edge fade", kind: "slider", min: 0, max: 0.4, step: 0.01, default: 0.16, group: "Layout" },
    { prop: "tilt", label: "Tilt", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Look" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.05, default: 1, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Scroll, hover and lean", kind: "switch", default: true, group: "Cursor" },
  ],
};
