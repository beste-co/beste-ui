/**
 * Playground for `kbd-sheet`: in place or as a dialog, the search and the surface.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "?", does: "Opens and closes the sheet as a dialog, unless focus is in a field." },
    { keys: "Type in the search", does: "Filters by label, by the keys as written and by their names on either platform." },
    { keys: "Escape in the search", does: "Clears the search; a second Escape closes the dialog." },
  ],
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "Keyboard shortcuts", group: "Content" },
    { prop: "inline", label: "In place", kind: "switch", default: false, group: "Mode" },
    { prop: "searchable", label: "Search", kind: "switch", default: true, group: "Mode" },
    { prop: "tone", label: "Tone", kind: "segmented", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
