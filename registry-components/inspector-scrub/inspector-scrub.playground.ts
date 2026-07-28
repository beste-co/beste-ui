/**
 * Playground for `inspector-scrub`: the props its documentation page lets a reader
 * turn, and every gesture it answers.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Letter spacing" },
    { prop: "suffix", label: "Suffix", kind: "text", placeholder: "em" },
    {
      prop: "sensitivity",
      label: "Sensitivity",
      kind: "slider",
      min: 1,
      max: 24,
      step: 1,
      unit: "px",
      default: 4,
    },
    { prop: "precision", label: "Decimals", kind: "stepper", min: 0, max: 3, step: 1, default: 2 },
    { prop: "softMin", label: "Bar from", kind: "slider", min: -1, max: 0, step: 0.05 },
    { prop: "softMax", label: "Bar to", kind: "slider", min: 0, max: 2, step: 0.05 },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Hover the row", does: "Lights the whole track and shows the grip" },
    { keys: "Drag the row", does: "Runs the number with the pointer, from wherever you pressed" },
    { keys: "Shift + drag", does: "Ten times the step" },
    { keys: "Alt + drag", does: "A tenth of it" },
    { keys: "Click the label", does: "Puts the caret in the field to type an exact value" },
    { keys: "Up / Down", does: "Step the value; Shift for ten of them" },
    { keys: "Escape", does: "Throw away what was typed" },
  ],
};
