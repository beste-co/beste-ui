/**
 * Playground for `text17`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "value", label: "Value", kind: "stepper", min: 0, max: 100000, step: 1 },
    { prop: "prefix", label: "Prefix", kind: "text", placeholder: "$" },
    { prop: "suffix", label: "Suffix", kind: "text", placeholder: "+" },
    { prop: "grouping", label: "Group thousands", kind: "switch", default: true },
    { prop: "tick", label: "Climb every", kind: "stepper", min: 0, max: 10, step: 0.5, unit: "s", group: "Timing" },
    { prop: "duration", label: "Per digit", kind: "stepper", min: 0.2, max: 4, step: 0.1, default: 1.2, unit: "s", group: "Timing" },
  ],
};
