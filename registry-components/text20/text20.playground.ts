/**
 * Playground for `text20`: the text and every part of the push.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Loud type, strict grid." },
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "span"], default: "p" },
    { prop: "force", label: "Push", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
    { prop: "reach", label: "Reach", kind: "slider", min: 80, max: 480, step: 10, default: 240, unit: "px", group: "Cursor" },
    { prop: "tilt", label: "Lean", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
    { prop: "stretch", label: "Stretch", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
    { prop: "bounce", label: "Bounce", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
    { prop: "entrance", label: "Drop in", kind: "switch", default: true, group: "Entrance" },
    { prop: "delay", label: "Delay", kind: "stepper", min: 0, max: 2, step: 0.05, default: 0.15, unit: "s", group: "Entrance" },
    { prop: "stagger", label: "Between letters", kind: "stepper", min: 0, max: 0.2, step: 0.005, default: 0.035, unit: "s", group: "Entrance" },
  ],
};
