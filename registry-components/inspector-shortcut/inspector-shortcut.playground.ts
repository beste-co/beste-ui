/**
 * Playground for `inspector-shortcut`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Enter / Space", does: "Start listening. The row then takes the next combination as the binding." },
    { keys: "Any combination", does: "Recorded as it is pressed. Cmd and Ctrl are both stored as `Mod`, so one value reads right on either platform." },
    { keys: "A modifier on its own", does: "Ignored: it is the reader still reaching for the second key." },
    { keys: "Backspace / Delete", does: "Clear the binding while listening." },
    { keys: "Escape", does: "Stop listening and keep what was there." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Command palette" },
    { prop: "requireModifier", label: "Require a modifier", kind: "switch", default: false },
    { prop: "emptyLabel", label: "Empty label", kind: "text", placeholder: "Not set" },
    { prop: "forcePlainNames", label: "Plain key names", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
