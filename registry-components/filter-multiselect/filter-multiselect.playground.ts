/**
 * Playground for `filter-multiselect`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move between the boxes \u2014 each is its own control, not one list with an inner cursor." },
    { keys: "Space", does: "Tick or untick the focused one." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Size" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "All sizes" },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false },
  ],
};
