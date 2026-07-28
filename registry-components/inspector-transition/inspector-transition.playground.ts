/**
 * Playground for `inspector-transition`: the props its documentation page lets a
 * reader turn.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Transition" },
    {
      prop: "maxDuration",
      label: "Max time",
      kind: "slider",
      min: 200,
      max: 4000,
      step: 100,
      unit: "ms",
      default: 2000,
    },
    { prop: "step", label: "Step", kind: "stepper", min: 1, max: 100, step: 1, default: 10 },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Enter / Space", does: "Open the editor from the row" },
    { keys: "Left / Right", does: "Step a focused time slider" },
    { keys: "Escape", does: "Close the editor, leaving the value alone" },
  ],
};
