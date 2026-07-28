/**
 * Playground for `inspector-border`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Border" },
    { prop: "maxWidth", label: "Max width", kind: "stepper", min: 1, max: 64, default: 16, unit: "px" },
    { prop: "format", label: "Colour format", kind: "select", options: ["hex", "oklch", "rgb"], default: "hex" },
    { prop: "alpha", label: "Alpha", kind: "switch", default: true },
    ...SURFACE_CONTROLS,
  ],
};
