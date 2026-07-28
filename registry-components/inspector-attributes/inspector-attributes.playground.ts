/**
 * Playground for `inspector-attributes`: the props its documentation page lets a
 * reader turn.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Attributes" },
    { prop: "keyPlaceholder", label: "Name ghost text", kind: "text", placeholder: "name" },
    { prop: "valuePlaceholder", label: "Value ghost text", kind: "text", placeholder: "value" },
    { prop: "max", label: "Max pairs", kind: "stepper", min: 1, max: 20, step: 1 },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Enter / Space", does: "Open the editor from the row" },
    { keys: "Tab", does: "Walks name, value, remove, then the next line" },
    { keys: "Typing a name", does: "Drops anything that cannot be in one, spaces included" },
  ],
};
