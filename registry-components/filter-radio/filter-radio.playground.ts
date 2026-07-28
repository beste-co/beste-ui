/**
 * Playground for `filter-radio`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow keys", does: "Move through the options. A radio group is one tab stop, so the arrows are how you get around inside it." },
    { keys: "Space", does: "Take the focused option." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Fit" },
    { prop: "allowClear", label: "Allow clear", kind: "switch", default: true },
  ],
};
