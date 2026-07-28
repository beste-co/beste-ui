/**
 * Playground for `filter-select`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Enter / Space", does: "Open the menu." },
    { keys: "Arrow keys", does: "Move through the options; the value follows as you go." },
    { keys: "Type a letter", does: "Jump to the next option starting with it." },
    { keys: "Escape", does: "Close and keep what was there before." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Category" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "All categories" },
    { prop: "clearLabel", label: "Clear label", kind: "text", placeholder: "All categories" },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false },
  ],
};
