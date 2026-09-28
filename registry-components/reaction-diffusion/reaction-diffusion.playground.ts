/**
 * Playground for `reaction-diffusion`: the chemistry, the growth and the look.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "accentColor", label: "Fronts", kind: "color", default: "var(--primary)", group: "Color" },
    { prop: "edges", label: "Front accent", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.8, group: "Color" },
    { prop: "relief", label: "Relief", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Color" },
    { prop: "feed", label: "Feed", kind: "slider", min: 0.02, max: 0.08, step: 0.0005, default: 0.0545, group: "Chemistry" },
    { prop: "kill", label: "Kill", kind: "slider", min: 0.045, max: 0.07, step: 0.0005, default: 0.062, group: "Chemistry" },
    { prop: "resolution", label: "Detail", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Growth" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Growth" },
    { prop: "seeding", label: "Self-seeding", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Growth" },
    { prop: "erase", label: "Eraser", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Growth" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Growth" },
    { prop: "interactive", label: "Seed with cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
