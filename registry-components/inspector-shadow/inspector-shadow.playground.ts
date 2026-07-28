/**
 * Playground for `inspector-shadow`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Shadow" },
    { prop: "maxOffset", label: "Max offset", kind: "stepper", min: 4, max: 200, default: 64, unit: "px" },
    { prop: "maxBlur", label: "Max blur", kind: "stepper", min: 4, max: 200, default: 100, unit: "px" },
    { prop: "maxSpread", label: "Max spread", kind: "stepper", min: 0, max: 100, default: 32, unit: "px" },
    { prop: "allowInset", label: "Allow inset", kind: "switch", default: true },
    { prop: "format", label: "Colour format", kind: "select", options: ["hex", "oklch", "rgb"], default: "hex" },
    ...SURFACE_CONTROLS,
  ],
};
