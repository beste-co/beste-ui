/**
 * Playground for `silk-drape`: the silk, the light and how the fabric hangs.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "color", label: "Silk", kind: "color", default: "#1f5c4c", group: "Color" },
    { prop: "backgroundColor", label: "Background", kind: "color", default: "#07120f", group: "Color" },
    { prop: "sheen", label: "Sheen", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Light" },
    { prop: "lightAngle", label: "Light angle", kind: "slider", min: 0, max: 360, step: 5, default: 125, unit: "°", group: "Light" },
    { prop: "stiffness", label: "Stiffness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Fabric" },
    { prop: "pins", label: "Pins", kind: "stepper", min: 2, max: 9, step: 1, default: 5, group: "Fabric" },
    { prop: "detail", label: "Detail", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Fabric" },
    { prop: "wind", label: "Breeze", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.45, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
