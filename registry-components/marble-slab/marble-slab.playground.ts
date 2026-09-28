/**
 * Playground for `marble-slab`: the stone, its veins and the polish over it.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "groundColor", label: "Ground", kind: "color", default: "#f3eee6", group: "Color" },
    { prop: "veinColor", label: "Veins", kind: "color", default: "#5f5a57", group: "Color" },
    { prop: "accentColor", label: "Vein edge", kind: "color", default: "#b8925f", group: "Color" },
    { prop: "scale", label: "Scale", kind: "slider", min: 0.4, max: 2.5, step: 0.05, default: 1, unit: "x", group: "Stone" },
    { prop: "veins", label: "Veins", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Stone" },
    { prop: "warp", label: "Warp", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Stone" },
    { prop: "bookMatch", label: "Book match", kind: "switch", default: true, group: "Stone" },
    { prop: "gloss", label: "Gloss", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Polish" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Polish" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Cursor" },
  ],
};
