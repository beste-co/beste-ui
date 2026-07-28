/**
 * Playground for `inspector-toggles`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move between the pills — they are separate checkboxes, not one control with an inner cursor." },
    { keys: "Space", does: "Turn the focused pill on or off." },
  ],
  props: {
    label: "Weekend",
    options: ["Mon", "Tue", "Wed", "Thu"],
    defaultValue: ["Mon", "Wed"],
  },
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Weekend" },
    { prop: "min", label: "Min on", kind: "stepper", min: 0, max: 4, default: 0 },
    { prop: "max", label: "Max on", kind: "stepper", min: 1, max: 4, default: 4 },
    ...SURFACE_CONTROLS,
  ],
};
