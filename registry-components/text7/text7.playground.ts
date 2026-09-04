/**
 * Playground for `text7`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "value", label: "Value", kind: "stepper", min: 0, max: 10000, step: 10 },
    { prop: "prefix", label: "Prefix", kind: "text", placeholder: "$" },
    { prop: "suffix", label: "Suffix", kind: "text", placeholder: "+" },
    { prop: "decimals", label: "Decimals", kind: "stepper", min: 0, max: 3, default: 0 },
    { prop: "grouping", label: "Group thousands", kind: "switch", default: true },
    { prop: "as", label: "Element", kind: "select", options: ["p", "span", "dd", "strong"], default: "span" },
    { prop: "duration", label: "Count", kind: "stepper", min: 0.2, max: 6, step: 0.1, default: 2.2, unit: "s", group: "Timing" },
    { prop: "delay", label: "Delay", kind: "stepper", min: 0, max: 3, step: 0.1, default: 0, unit: "s", group: "Timing" },
  ],
};
