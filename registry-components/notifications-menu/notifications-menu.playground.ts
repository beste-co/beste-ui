/**
 * Playground for `notifications-menu`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Enter / Space", does: "Open the panel from the bell." },
    { keys: "Arrow keys", does: "Move through the notifications." },
    { keys: "Escape", does: "Close and put focus back on the bell." },
    { keys: "Mark all as read", does: "Clears every unread mark at once and calls `onMarkAllRead`; the badge on the bell goes with them." },
  ],
  controls: [
    { prop: "align", label: "Align", kind: "segmented", options: ["start", "center", "end"], default: "end" },
  ],
};
