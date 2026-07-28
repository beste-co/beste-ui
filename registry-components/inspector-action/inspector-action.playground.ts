/**
 * Playground for `inspector-action`: the props its documentation page lets a reader
 * turn.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Open asset library" },
    {
      prop: "description",
      label: "Description",
      kind: "text",
      placeholder: "Adds a second line",
    },
    { prop: "hint", label: "Hint", kind: "text", placeholder: "" },
    { prop: "destructive", label: "Destructive", kind: "switch", default: false },
    { prop: "busy", label: "Busy", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
