/**
 * Playground for `impasto`: the brushwork, the paint and the light.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "strokeSize", label: "Stroke size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Brushwork" },
    { prop: "strokes", label: "Strokes", kind: "slider", min: 300, max: 4000, step: 100, default: 2000, group: "Brushwork" },
    { prop: "flow", label: "Flow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Brushwork" },
    { prop: "paintTime", label: "Paint time", kind: "stepper", min: 2, max: 30, step: 1, default: 12, unit: "s", group: "Brushwork" },
    { prop: "thickness", label: "Thickness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Paint" },
    { prop: "sheen", label: "Sheen", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Paint" },
    { prop: "canvasTexture", label: "Linen", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Paint" },
    { prop: "primerColor", label: "Primer", kind: "color", default: "#efe8da", group: "Paint" },
    { prop: "repaint", label: "Repaint after", kind: "stepper", min: 0, max: 60, step: 1, default: 14, unit: "s", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "lightFollow", label: "Light follows cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "interactive", label: "Drag to paint", kind: "switch", default: true, group: "Cursor" },
  ],
};
