/**
 * Playground for `inspector-secret`: the props its documentation page lets a reader
 * turn, and every gesture it answers.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "API key" },
    { prop: "editable", label: "Editable", kind: "switch", default: false },
    { prop: "revealable", label: "Revealable", kind: "switch", default: true },
    { prop: "copyable", label: "Copyable", kind: "switch", default: true },
    {
      prop: "visibleSuffix",
      label: "Visible tail",
      kind: "stepper",
      min: 0,
      max: 8,
      step: 1,
      default: 4,
    },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Enter", does: "Commit an edit, while editable" },
    { keys: "Reveal", does: "Shows the whole value and fires onReveal once" },
    { keys: "Copy", does: "Copies the real value, revealed or not" },
  ],
};
