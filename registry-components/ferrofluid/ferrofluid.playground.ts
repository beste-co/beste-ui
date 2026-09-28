/**
 * Playground for `ferrofluid`: the fluid, the crown and the studio light.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "fluidColor", label: "Fluid", kind: "color", default: "#08080a", group: "Color" },
    { prop: "surfaceColor", label: "Surface", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "highlightColor", label: "Lights", kind: "color", default: "#ffffff", group: "Color" },
    { prop: "size", label: "Pool size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Crown" },
    { prop: "density", label: "Density", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Crown" },
    { prop: "spikeHeight", label: "Spike height", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Crown" },
    { prop: "reach", label: "Reach", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Crown" },
    { prop: "response", label: "Response", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "idleMagnet", label: "Idle magnet", kind: "switch", default: true, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "gloss", label: "Gloss", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.7, group: "Finish" },
    { prop: "highlight", label: "Highlights", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.8, group: "Finish" },
    { prop: "interactive", label: "Cursor magnet", kind: "switch", default: true, group: "Cursor" },
  ],
};
