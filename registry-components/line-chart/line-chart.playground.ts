/**
 * Playground for `line-chart`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hover the plot", does: "The tooltip follows the pointer and reads every line at that point." },
  ],
  controls: [
    { prop: "xKey", label: "X key", kind: "text", placeholder: "day" },
    { prop: "curve", label: "Curve", kind: "select", options: ["natural", "linear", "monotone", "step"], default: "natural" },
    { prop: "dots", label: "Dots", kind: "switch", default: false },
    { prop: "showGrid", label: "Grid", kind: "switch", default: true },
    { prop: "showYAxis", label: "Y axis", kind: "switch", default: false },
    { prop: "showLegend", label: "Legend", kind: "switch", default: false },
  ],
};
