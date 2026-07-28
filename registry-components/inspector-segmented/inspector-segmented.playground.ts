/**
 * Playground for `inspector-segmented`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow keys", does: "Move through the segments; the value follows as you go." },
    { keys: "Home / End", does: "Jump to the first or the last segment." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Align" },
    ...SURFACE_CONTROLS,
  ],
};
