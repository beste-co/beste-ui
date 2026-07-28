/**
 * Playground for `inspector-multicolor`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Palette" },
    { prop: "min", label: "Min colours", kind: "stepper", min: 1, max: 8, default: 1 },
    { prop: "max", label: "Max colours", kind: "stepper", min: 1, max: 16, default: 8 },
    { prop: "newColor", label: "New colour", kind: "color" },
    { prop: "format", label: "Format", kind: "select", options: ["hex", "oklch", "rgb"], default: "hex" },
    { prop: "alpha", label: "Alpha", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
