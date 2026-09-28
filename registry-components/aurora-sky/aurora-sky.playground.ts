/**
 * Playground for `aurora-sky`: the sky, the curtains and the wind.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "skyColor", label: "Sky", kind: "color", default: "#020409", group: "Sky" },
    { prop: "horizonColor", label: "Horizon", kind: "color", default: "#09121c", group: "Sky" },
    { prop: "stars", label: "Stars", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Sky" },
    { prop: "twinkle", label: "Twinkle", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Sky" },
    { prop: "lowColor", label: "Lower edge", kind: "color", default: "#33ff94", group: "Curtains" },
    { prop: "highColor", label: "Upper glow", kind: "color", default: "#2e80ff", group: "Curtains" },
    { prop: "fringeColor", label: "Far curtain", kind: "color", default: "#c74df2", group: "Curtains" },
    { prop: "edgeColor", label: "Fringe", kind: "color", default: "#ff5973", group: "Curtains" },
    { prop: "intensity", label: "Brightness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Curtains" },
    { prop: "curtains", label: "Curtains", kind: "stepper", min: 1, max: 4, step: 1, default: 4, group: "Curtains" },
    { prop: "height", label: "Height", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Curtains" },
    { prop: "rays", label: "Rays", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Curtains" },
    { prop: "mountains", label: "Mountains", kind: "switch", default: true, group: "Land" },
    { prop: "mountainColor", label: "Ridge", kind: "color", default: "#010204", group: "Land" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "wind", label: "Wind", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
