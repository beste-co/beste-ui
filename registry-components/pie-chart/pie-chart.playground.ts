/**
 * Playground for `pie-chart`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hover a slice", does: "The tooltip names the segment and its value." },
  ],
  controls: [
    { prop: "dataKey", label: "Value key", kind: "text", placeholder: "value" },
    { prop: "nameKey", label: "Name key", kind: "text", placeholder: "segment" },
    { prop: "donut", label: "Donut", kind: "stepper", min: 0, max: 0.9, default: 0.55, step: 0.05 },
    { prop: "showLegend", label: "Legend", kind: "switch", default: true },
  ],
};
