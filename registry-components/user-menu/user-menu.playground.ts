/**
 * Playground for `user-menu`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Enter / Space", does: "Open the menu from the trigger." },
    { keys: "Arrow keys", does: "Move through the items; separators and the header are skipped." },
    { keys: "Type a letter", does: "Jump to the next item starting with it." },
    { keys: "Escape", does: "Close and put focus back on the trigger." },
  ],
  controls: [
    { prop: "compact", label: "Compact", kind: "switch", default: false },
    { prop: "align", label: "Align", kind: "segmented", options: ["start", "center", "end"], default: "end" },
  ],
};
