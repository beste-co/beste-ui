/**
 * Playground for `inspector-row`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  // The building block the rest of the family is made of: a label, and whatever
  // control you put beside it.
  props: { label: "Custom", children: "Whatever you put here" },
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Custom" },
    { prop: "multiline", label: "Multiline", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
