/**
 * Playground for `inspector-spacing`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow Up / Down", does: "One step on the focused edge." },
    { keys: "Shift + Arrow", does: "Ten steps." },
    { keys: "Enter", does: "Accept what was typed into the field." },
    { keys: "Escape", does: "Throw the draft away and put the committed value back." },
    { keys: "The link toggle", does: "Ties the four edges together; typing into one then writes all four." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Padding" },
    { prop: "min", label: "Min", kind: "stepper", min: -100, max: 100, default: 0 },
    { prop: "max", label: "Max", kind: "stepper", min: 1, max: 400, default: 128 },
    { prop: "step", label: "Step", kind: "stepper", min: 0.5, max: 20, default: 1 },
    { prop: "suffix", label: "Suffix", kind: "text", placeholder: "px" },
    { prop: "defaultLinked", label: "Linked", kind: "switch", default: true },
    { prop: "hideLink", label: "Hide link toggle", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
