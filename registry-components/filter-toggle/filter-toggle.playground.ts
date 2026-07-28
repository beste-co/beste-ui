/**
 * Playground for `filter-toggle`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Space / Enter", does: "Flip the focused switch. The label points at it, so the whole row is the target." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Deals" },
  ],
};
