/**
 * Playground for `radial-chart`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "value", label: "Value", kind: "stepper", min: 0, max: 1000, default: 68 },
    { prop: "max", label: "Max", kind: "stepper", min: 1, max: 1000, default: 100 },
    { prop: "label", label: "Label", kind: "text", placeholder: "On track for 80% target" },
    { prop: "valueLabel", label: "Value label", kind: "text", placeholder: "68%" },
    { prop: "color", label: "Colour", kind: "text", placeholder: "var(--chart-1)" },
  ],
};
