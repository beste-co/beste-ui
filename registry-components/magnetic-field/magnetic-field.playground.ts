/**
 * Playground for `magnetic-field`: the filings, the poles and the shockwave.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "contrast", label: "Contrast", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Color" },
    { prop: "spacing", label: "Spacing", kind: "slider", min: 12, max: 48, step: 1, default: 24, unit: "px", group: "Filings" },
    { prop: "length", label: "Length", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Filings" },
    { prop: "weight", label: "Weight", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Filings" },
    { prop: "stiffness", label: "Stiffness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Filings" },
    { prop: "poleStrength", label: "Pull", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Poles" },
    { prop: "secondPole", label: "Second pole", kind: "switch", default: true, group: "Poles" },
    { prop: "speed", label: "Drift", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Poles" },
    { prop: "shockwave", label: "Shockwave", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Pulse" },
    { prop: "pulseInterval", label: "Idle pulse", kind: "slider", min: 0, max: 15, step: 0.5, default: 6.5, unit: "s", group: "Pulse" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Pulse" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Pulse" },
  ],
};
