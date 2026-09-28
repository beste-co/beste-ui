/**
 * Playground for `bauhaus-composition`: the palette, the cast and how it moves.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "accentColor", label: "Accent", kind: "color", default: "#d9412b", group: "Color" },
    { prop: "secondaryColor", label: "Secondary", kind: "color", default: "#e3b23c", group: "Color" },
    { prop: "tertiaryColor", label: "Tertiary", kind: "color", default: "#2c5aa0", group: "Color" },
    { prop: "overprint", label: "Overprint", kind: "switch", default: true, group: "Color" },
    { prop: "shapes", label: "Forms", kind: "slider", min: 6, max: 24, step: 1, default: 14, group: "Composition" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 1, max: 99, step: 1, default: 7, group: "Composition" },
    { prop: "columns", label: "Grid columns", kind: "slider", min: 6, max: 16, step: 2, default: 12, group: "Composition" },
    { prop: "interval", label: "Hold", kind: "slider", min: 2, max: 12, step: 0.5, default: 4, unit: "s", group: "Motion" },
    { prop: "stiffness", label: "Stiffness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "bounce", label: "Bounce", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "stagger", label: "Stagger", kind: "slider", min: 0, max: 0.2, step: 0.01, default: 0.06, unit: "s", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "repel", label: "Repel", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
