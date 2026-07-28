/**
 * Playground for `inspector-meter`: the props its documentation page lets a reader
 * turn.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Contrast" },
    { prop: "value", label: "Reading", kind: "slider", min: 1, max: 21, step: 0.1 },
    { prop: "suffix", label: "Suffix", kind: "text", placeholder: ":1" },
    { prop: "precision", label: "Decimals", kind: "stepper", min: 0, max: 3, step: 1, default: 0 },
    { prop: "showBar", label: "Show bar", kind: "switch", default: true },
    {
      prop: "status",
      label: "Status",
      kind: "select",
      options: ["neutral", "success", "warning", "danger"],
    },
    ...SURFACE_CONTROLS,
  ],
};
