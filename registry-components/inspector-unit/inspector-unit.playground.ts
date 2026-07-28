/**
 * Playground for `inspector-unit`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow Up / Down", does: "One step on the number, the way a stepper moves: a length is a number first and a string second." },
    { keys: "Shift + Arrow", does: "Ten steps." },
    { keys: "Enter", does: "Accept what was typed." },
    { keys: "Escape", does: "Throw the draft away and put the committed value back." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Width" },
    { prop: "min", label: "Min", kind: "stepper", min: -1000, max: 1000, default: 0 },
    { prop: "max", label: "Max", kind: "stepper", min: 1, max: 4000, default: 100 },
    { prop: "step", label: "Step", kind: "stepper", min: 0.1, max: 50, default: 1 },
    { prop: "precision", label: "Precision", kind: "stepper", min: 0, max: 4, default: 2 },
    ...SURFACE_CONTROLS,
  ],
};
