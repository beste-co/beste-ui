/**
 * Playground for `radar-chart`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hover the web", does: "The tooltip reads every series on the nearest axis." },
  ],
  controls: [
    { prop: "angleKey", label: "Angle key", kind: "text", placeholder: "metric" },
    { prop: "fillOpacity", label: "Fill opacity", kind: "stepper", min: 0, max: 1, default: 0.5, step: 0.05 },
    { prop: "showLegend", label: "Legend", kind: "switch", default: false },
  ],
};
