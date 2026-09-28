/**
 * Playground for `ink-fluid`: the ground, the flow and the ink.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "groundColor", label: "Ground", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "pigment1", label: "Pigment 1", kind: "color", default: "#1a264c", group: "Color" },
    { prop: "pigment2", label: "Pigment 2", kind: "color", default: "#d32f1a", group: "Color" },
    { prop: "pigment3", label: "Pigment 3", kind: "color", default: "#27272a", group: "Color" },
    { prop: "vorticity", label: "Vorticity", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Flow" },
    { prop: "fade", label: "Fade", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.3, group: "Flow" },
    { prop: "pressureIterations", label: "Solver passes", kind: "stepper", min: 4, max: 40, step: 1, default: 18, group: "Flow" },
    { prop: "simResolution", label: "Flow grid", kind: "stepper", min: 64, max: 256, step: 32, default: 128, group: "Quality" },
    { prop: "dyeResolution", label: "Ink grid", kind: "stepper", min: 256, max: 1024, step: 128, default: 512, group: "Quality" },
    { prop: "splatSize", label: "Splash size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Ink" },
    { prop: "force", label: "Force", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Ink" },
    { prop: "autoInterval", label: "Drop every", kind: "stepper", min: 0, max: 8, step: 0.2, default: 2.2, unit: "s", group: "Ink" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Cursor" },
  ],
};
