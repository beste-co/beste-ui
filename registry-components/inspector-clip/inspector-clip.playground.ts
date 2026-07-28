/**
 * Playground for `inspector-clip`: the props its documentation page lets a reader
 * turn.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Shape" },
    { prop: "columns", label: "Columns", kind: "stepper", min: 2, max: 6, step: 1, default: 5 },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Enter / Space", does: "Open the grid from the row" },
    { keys: "Tab", does: "Walks the shapes in the order they read" },
    { keys: "Left / Right", does: "Step the amount, for a shape that has one" },
  ],
};
