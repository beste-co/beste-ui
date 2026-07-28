/**
 * Playground for `inspector-select`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Enter / Space", does: "Open the menu." },
    { keys: "Arrow keys", does: "Move through the options; the value follows as you go." },
    { keys: "Type a letter", does: "Jump to the next option starting with it." },
    { keys: "Escape", does: "Close and keep what was there before." },
  ],
  props: {
    label: "Font",
    options: ["Inter", "Geist", "Söhne", "Untitled Sans"],
    defaultValue: "Inter",
  },
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Font" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "Select" },
    {
      prop: "menuWidth",
      label: "Menu width",
      kind: "segmented",
      options: ["trigger", "auto"],
      default: "trigger",
    },
    ...SURFACE_CONTROLS,
  ],
};
