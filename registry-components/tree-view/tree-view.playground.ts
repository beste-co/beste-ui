/**
 * Playground for `tree-view`: how the tree selects, what it draws and its surface.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow Up / Down", does: "Move between visible items; the tree is one tab stop." },
    { keys: "Arrow Right", does: "Open a closed folder, or step into an open one." },
    { keys: "Arrow Left", does: "Close an open folder, or climb to the parent." },
    { keys: "Home / End", does: "Jump to the first or last visible item." },
    { keys: "*", does: "Open every folder at the focused item's level." },
    { keys: "Type a name", does: "Jump to the next item starting with the letters typed." },
    { keys: "Enter / Double-click", does: "Select the item and run onAction; without one, a folder opens or closes." },
    { keys: "Space", does: "Select the item; in multiple mode it toggles, with Shift it selects a range." },
    { keys: "Shift + Arrow / Click", does: "Extend a range in multiple mode." },
    { keys: "Cmd or Ctrl + Click", does: "Toggle one item in multiple mode." },
    { keys: "Cmd or Ctrl + A", does: "Select every visible item in multiple mode." },
  ],
  controls: [
    { prop: "selectionMode", label: "Selection", kind: "segmented", options: ["single", "multiple", "none"], default: "single", group: "Tree" },
    { prop: "expandOnClick", label: "Open on click", kind: "switch", default: true, group: "Tree" },
    { prop: "guides", label: "Guides", kind: "switch", default: true, group: "Tree" },
    { prop: "icons", label: "Icons", kind: "switch", default: true, group: "Tree" },
    { prop: "tone", label: "Tone", kind: "select", options: ["ghost", "muted", "outline"], default: "ghost", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
