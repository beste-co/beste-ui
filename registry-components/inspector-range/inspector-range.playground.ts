/**
 * Playground for `inspector-range`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move between the two thumbs." },
    { keys: "Arrow keys", does: "One step on the focused thumb." },
    { keys: "Home / End", does: "Send the focused thumb to its end of the range." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Price" },
    { prop: "min", label: "Min", kind: "stepper", min: -1000, max: 1000, default: 0 },
    { prop: "max", label: "Max", kind: "stepper", min: -1000, max: 1000, default: 100 },
    { prop: "step", label: "Step", kind: "stepper", min: 0.1, max: 50, default: 1 },
    { prop: "unit", label: "Unit", kind: "text", placeholder: "$" },
    { prop: "separator", label: "Separator", kind: "text", placeholder: "–" },
    { prop: "ticks", label: "Ticks", kind: "switch", default: false },
    {
      prop: "minStepsBetweenThumbs",
      label: "Min gap",
      kind: "stepper",
      min: 0,
      max: 20,
      default: 0,
    },
    ...SURFACE_CONTROLS,
  ],
};
