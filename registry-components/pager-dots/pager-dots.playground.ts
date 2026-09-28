/**
 * Playground for `pager-dots`: the set, autoplay and the window.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Enter or leave the dots. The whole set is one stop, landing on the active page." },
    { keys: "Arrow keys", does: "Move to the previous or next page, wrapping at the ends. Up and down in a column." },
    { keys: "Home / End", does: "Jump to the first or the last page." },
    { keys: "Hover or keyboard focus", does: "Pauses autoplay until the pointer or focus leaves." },
  ],
  controls: [
    { prop: "count", label: "Pages", kind: "stepper", min: 1, max: 30, step: 1, default: 12, group: "Pages" },
    { prop: "visible", label: "Window", kind: "stepper", min: 3, max: 15, step: 1, default: 7, group: "Pages" },
    { prop: "duration", label: "Duration", kind: "slider", min: 1000, max: 10000, step: 500, unit: "ms", group: "Autoplay" },
    { prop: "playing", label: "Playing", kind: "switch", default: true, group: "Autoplay" },
    { prop: "loop", label: "Loop", kind: "switch", default: true, group: "Autoplay" },
    { prop: "orientation", label: "Orientation", kind: "segmented", options: ["horizontal", "vertical"], default: "horizontal", group: "Layout" },
    ...SURFACE_CONTROLS,
  ],
};
