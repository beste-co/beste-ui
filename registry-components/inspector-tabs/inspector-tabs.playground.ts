/**
 * Playground for `inspector-tabs`: the props its documentation page lets a reader
 * turn, and every gesture it answers.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    {
      prop: "value",
      label: "Active tab",
      kind: "segmented",
      options: ["design", "content"],
      default: "design",
    },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Left / Right", does: "Move to the next tab and select it" },
    { keys: "Home / End", does: "Jump to the first or last tab" },
    { keys: "Tab", does: "Leaves the strip for whatever the panel puts after it" },
  ],
};
