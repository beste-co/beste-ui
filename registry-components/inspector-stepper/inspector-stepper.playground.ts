/**
 * Playground for `inspector-stepper`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow Up / Down", does: "One step." },
    { keys: "Shift + Arrow", does: "Ten steps." },
    { keys: "Page Up / Page Down", does: "Ten steps, without reaching for Shift." },
    { keys: "Home / End", does: "Jump to the minimum or the maximum." },
    { keys: "Enter", does: "Accept what was typed into the field." },
    { keys: "Escape", does: "Throw the draft away and put the committed value back." },
    { keys: "Hold a button", does: "Repeats, and speeds up the longer it is held." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Columns" },
    { prop: "min", label: "Min", kind: "stepper", min: -1000, max: 1000, default: 0 },
    { prop: "max", label: "Max", kind: "stepper", min: -1000, max: 1000, default: 100 },
    { prop: "step", label: "Step", kind: "stepper", min: 0.1, max: 50, default: 1 },
    { prop: "suffix", label: "Suffix", kind: "text", placeholder: "px" },
    ...SURFACE_CONTROLS,
  ],
};
