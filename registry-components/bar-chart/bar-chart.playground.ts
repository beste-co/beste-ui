/**
 * Playground for `bar-chart`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hover a bar", does: "The tooltip reads every series in that column, not just the bar under the pointer." },
  ],
  controls: [
    { prop: "xKey", label: "X key", kind: "text", placeholder: "month" },
    { prop: "stacked", label: "Stacked", kind: "switch", default: false },
    { prop: "radius", label: "Corner radius", kind: "stepper", min: 0, max: 16, default: 4, unit: "px" },
    { prop: "showGrid", label: "Grid", kind: "switch", default: true },
    { prop: "showYAxis", label: "Y axis", kind: "switch", default: false },
    { prop: "showLegend", label: "Legend", kind: "switch", default: false },
  ],
};
