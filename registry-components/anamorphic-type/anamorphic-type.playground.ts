/**
 * Playground for `anamorphic-type`: the fragments, the scatter and the camera.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "It only makes sense from here." },
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "div"], default: "div" },
    { prop: "fragment", label: "Fragment", kind: "segmented", options: ["dots", "dashes"], default: "dots", group: "Fragments" },
    { prop: "density", label: "Density", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Fragments" },
    { prop: "color", label: "Color", kind: "color", default: "currentColor", group: "Fragments" },
    { prop: "accentColor", label: "Accent", kind: "color", default: "var(--primary)", group: "Fragments" },
    { prop: "accent", label: "Accent share", kind: "slider", min: 0, max: 0.5, step: 0.01, default: 0.08, group: "Fragments" },
    { prop: "depth", label: "Depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Scatter" },
    { prop: "orbit", label: "Orbit", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Camera" },
    { prop: "interval", label: "Resolve every", kind: "stepper", min: 1.5, max: 15, step: 0.5, default: 6, unit: "s", group: "Camera" },
    { prop: "hold", label: "Hold", kind: "stepper", min: 0.3, max: 8, step: 0.1, default: 2.2, unit: "s", group: "Camera" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Camera" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Camera" },
  ],
};
