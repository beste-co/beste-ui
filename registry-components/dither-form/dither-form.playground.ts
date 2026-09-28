/**
 * Playground for `dither-form`: the ink, the form and how it moves.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "exposure", label: "Exposure", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Color" },
    { prop: "backdrop", label: "Backdrop", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Color" },
    { prop: "shape", label: "Form", kind: "segmented", options: ["torus", "blobs", "rings"], default: "torus", group: "Form" },
    { prop: "pattern", label: "Dither", kind: "segmented", options: ["bayer8", "bayer4"], default: "bayer8", group: "Form" },
    { prop: "pixelSize", label: "Pixel size", kind: "stepper", min: 1, max: 12, step: 1, default: 3, unit: "px", group: "Form" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "tilt", label: "Tilt", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
