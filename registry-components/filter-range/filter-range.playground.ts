/**
 * Playground for `filter-range`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Price" },
    { prop: "min", label: "Min", kind: "stepper", min: 0, max: 10000, default: 0 },
    { prop: "max", label: "Max", kind: "stepper", min: 1, max: 10000, default: 500 },
  ],
};
