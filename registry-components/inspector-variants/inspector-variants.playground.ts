/**
 * Playground for `inspector-variants`: the props its documentation page lets a
 * reader turn.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Template" },
    { prop: "columns", label: "Columns", kind: "stepper", min: 1, max: 4, step: 1, default: 3 },
    { prop: "ratio", label: "Ratio", kind: "segmented", options: ["4 / 3", "1 / 1", "16 / 9"] },
    {
      prop: "fit",
      label: "Fit",
      kind: "segmented",
      options: ["cover", "contain"],
      default: "cover",
    },
    { prop: "captioned", label: "Captions", kind: "switch", default: true },
    { prop: "clearable", label: "Clearable", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Enter / Space", does: "Open the grid from the row" },
    { keys: "Tab", does: "Walks the pictures in the order they read" },
    { keys: "Escape", does: "Close the grid, leaving the value alone" },
  ],
};
