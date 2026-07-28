/**
 * Playground for `inspector-tracks`: the props its documentation page lets a reader
 * turn, and every gesture it answers.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Columns" },
    { prop: "minTracks", label: "Min tracks", kind: "stepper", min: 1, max: 6, step: 1, default: 1 },
    {
      prop: "maxTracks",
      label: "Max tracks",
      kind: "stepper",
      min: 1,
      max: 12,
      step: 1,
      default: 12,
    },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Up / Down", does: "Step the focused track size" },
    { keys: "Shift + Up / Down", does: "Step it by ten" },
    { keys: "Enter", does: "Accept what was typed" },
    { keys: "Escape", does: "Throw away what was typed, or close the editor" },
  ],
};
