/**
 * Playground for `sun-blinds`: the wall, the blinds and the light moving through them.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "wallColor", label: "Wall", kind: "color", default: "#d4bfa8", group: "Color" },
    { prop: "lightColor", label: "Light", kind: "color", default: "#ffcc8c", group: "Color" },
    { prop: "slats", label: "Slats", kind: "slider", min: 4, max: 24, step: 1, default: 12, group: "Blinds" },
    { prop: "softness", label: "Softness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Blinds" },
    { prop: "sway", label: "Sway", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Blinds" },
    { prop: "leaves", label: "Plant shadow", kind: "switch", default: true, group: "Room" },
    { prop: "dust", label: "Dust", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Room" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "follow", label: "Follow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
