/**
 * Playground for `tree-json`: how much opens, how arrays are chunked and the surface.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Arrow Up / Down", does: "Move between visible rows; the tree is one tab stop." },
    { keys: "Arrow Right", does: "Open a closed object or array, or step into an open one." },
    { keys: "Arrow Left", does: "Close an open object or array, or climb to the parent." },
    { keys: "Home / End", does: "Jump to the first or last visible row." },
    { keys: "Enter / Space", does: "Open or close the row, or show the next chunk on a Show more row." },
    { keys: "*", does: "Open every object and array at the focused row's level." },
    { keys: "Cmd or Ctrl + C", does: "Copy the focused row's value; with Shift, its path." },
    { keys: "Arrow Down in the search", does: "Jump to the first match." },
  ],
  controls: [
    { prop: "rootName", label: "Root name", kind: "text", placeholder: "data", group: "Tree" },
    { prop: "expandDepth", label: "Open depth", kind: "stepper", min: 1, max: 6, step: 1, default: 1, group: "Tree" },
    { prop: "chunkSize", label: "Chunk size", kind: "stepper", min: 1, max: 200, step: 1, default: 100, group: "Tree" },
    { prop: "searchable", label: "Search", kind: "switch", default: false, group: "Tree" },
    { prop: "copyable", label: "Copy buttons", kind: "switch", default: true, group: "Tree" },
    { prop: "tone", label: "Tone", kind: "select", options: ["ghost", "muted", "outline"], default: "ghost", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
