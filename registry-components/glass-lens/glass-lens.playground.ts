/**
 * Playground for `glass-lens`: the type, the glass and how it moves.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "See through everything." },
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "tintColor", label: "Tint", kind: "color", default: "var(--primary)", group: "Color" },
    { prop: "tint", label: "Tint strength", kind: "slider", min: 0, max: 1, step: 0.02, default: 0.08, group: "Color" },
    { prop: "blobs", label: "Drops", kind: "slider", min: 1, max: 4, step: 1, default: 3, group: "Glass" },
    { prop: "size", label: "Size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Glass" },
    { prop: "smoothness", label: "Merge", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Glass" },
    { prop: "refraction", label: "Refraction", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Optics" },
    { prop: "magnify", label: "Magnify", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Optics" },
    { prop: "dispersion", label: "Dispersion", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Optics" },
    { prop: "rim", label: "Rim", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Optics" },
    { prop: "highlight", label: "Highlight", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Optics" },
    { prop: "speed", label: "Drift speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Motion" },
  ],
};
