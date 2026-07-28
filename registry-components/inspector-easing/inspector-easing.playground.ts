/**
 * Playground for `inspector-easing`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move between the two control points; each is its own button." },
    { keys: "Arrow keys", does: "Nudge the focused point. Left and Right move it in time, Up and Down in value." },
    { keys: "Shift + Arrow", does: "Ten times the step, for crossing the curve quickly." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Easing" },
    { prop: "hidePreview", label: "Hide preview", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
