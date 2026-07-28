/**
 * Playground for `inspector-dimensions`: the props its documentation page lets a
 * reader turn, and every gesture it answers.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Size" },
    { prop: "suffix", label: "Unit", kind: "text", placeholder: "px" },
    { prop: "step", label: "Step", kind: "stepper", min: 1, max: 100, step: 1, default: 1 },
    { prop: "lockable", label: "Lockable", kind: "switch", default: true },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Up / Down", does: "Step the focused number" },
    { keys: "Shift + Up / Down", does: "Step it by ten" },
    { keys: "Enter", does: "Accept what was typed" },
    { keys: "Escape", does: "Throw away what was typed and put the value back" },
    { keys: "Lock", does: "Ties the two together at the ratio they have when it closes" },
  ],
};
