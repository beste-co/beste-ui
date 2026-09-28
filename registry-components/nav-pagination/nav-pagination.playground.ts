/**
 * Playground for `nav-pagination`: the page list, the extras and the strip.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move through the arrows, the pages and the page size menu in order." },
    { keys: "Enter / Space", does: "Go to the focused page, or open an ellipsis into the go to page field." },
    { keys: "Enter (in the field)", does: "Jump to the typed page. Out of range marks the field invalid and keeps it open." },
    { keys: "Escape", does: "Close the go to page field without jumping." },
  ],
  controls: [
    { prop: "total", label: "Items", kind: "stepper", min: 0, max: 2000, step: 10, default: 312, group: "Pages" },
    { prop: "siblings", label: "Siblings", kind: "stepper", min: 0, max: 3, step: 1, default: 1, group: "Pages" },
    { prop: "boundaries", label: "Boundaries", kind: "stepper", min: 1, max: 3, step: 1, default: 1, group: "Pages" },
    { prop: "showLabels", label: "Arrow labels", kind: "switch", default: false, group: "Extras" },
    { prop: "showRange", label: "Range", kind: "switch", default: false, group: "Extras" },
    { prop: "align", label: "Align", kind: "select", options: ["start", "center", "end"], default: "center", group: "Extras" },
    ...SURFACE_CONTROLS.map((control) => (control.prop === "tone" ? { ...control, default: "ghost" } : control)),
  ],
};
