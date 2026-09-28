/**
 * Playground for `concertina-book`: the pages and how they fold.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "pages", label: "Pages", kind: "stepper", min: 2, max: 12, step: 1, default: 6, group: "Book" },
    { prop: "pageAspect", label: "Page aspect", kind: "slider", min: 0.5, max: 1.2, step: 0.02, default: 0.72, group: "Book" },
    { prop: "fold", label: "Fold angle", kind: "slider", min: 20, max: 88, step: 1, default: 78, unit: "°", group: "Folds" },
    { prop: "shade", label: "Shade", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Folds" },
    { prop: "autoplay", label: "Autoplay", kind: "switch", default: false, group: "Motion" },
    { prop: "cycle", label: "Loop", kind: "stepper", min: 3, max: 20, step: 0.5, default: 9, unit: "s", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
  ],
};
