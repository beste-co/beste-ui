/**
 * Playground for `reaction-picker`: the grid's density, the recent row and every key it answers.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Type in the field", does: "Filter by name and keywords; Enter picks the first match and Escape clears the search." },
    { keys: "Arrow down from the field", does: "Move into the grid." },
    { keys: "Arrow keys in the grid", does: "Move between emoji; up and down keep the column across sections, and up from the top row returns to the field." },
    { keys: "Home / End", does: "Jump to the first or the last emoji." },
    { keys: "Enter / Space", does: "Pick the focused emoji." },
    { keys: "Escape in the skin tone row", does: "Close it and return to the tone button." },
  ],
  controls: [
    { prop: "columns", label: "Columns", kind: "stepper", min: 6, max: 10, step: 1, default: 8, group: "Grid" },
    { prop: "recent", label: "Recently used", kind: "switch", default: true, group: "Grid" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "Search emoji", group: "Grid" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
