/**
 * Playground for `contour-terrain`: the map's ink, the land and the camera.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "accentColor", label: "Summits", kind: "color", default: "var(--primary)", group: "Color" },
    { prop: "summits", label: "Summit tint", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Color" },
    { prop: "lines", label: "Contours", kind: "slider", min: 6, max: 48, step: 1, default: 22, group: "Map" },
    { prop: "indexLines", label: "Index contours", kind: "switch", default: true, group: "Map" },
    { prop: "shading", label: "Shading", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Map" },
    { prop: "tilt", label: "Tilt", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Land" },
    { prop: "relief", label: "Relief", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Land" },
    { prop: "haze", label: "Haze", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Land" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "pull", label: "Swell", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
