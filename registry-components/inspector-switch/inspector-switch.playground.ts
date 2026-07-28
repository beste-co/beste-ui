/**
 * Playground for `inspector-switch`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Space / Enter", does: "Flip it. The switch is a button, so both keys work on it." },
    { keys: "Click anywhere in the row", does: "The label owns the row's spare width and points at the switch by id, so the target is the whole row rather than the track at its end." },
  ],
  props: { label: "Auto layout", defaultChecked: true },
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Auto layout" },
    { prop: "checked", label: "Checked", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
