/**
 * Playground for `inspector-align`: the props its documentation page lets a reader
 * turn.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Align" },
    { prop: "directional", label: "Direction", kind: "switch", default: true },
    { prop: "distributable", label: "Distribute", kind: "switch", default: true },
    { prop: "stretchable", label: "Stretch", kind: "switch", default: true },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Enter / Space", does: "Open the editor from the row" },
    { keys: "Tab", does: "Walks the nine cells in the order they read" },
    { keys: "Escape", does: "Close the editor, leaving the value alone" },
  ],
};
