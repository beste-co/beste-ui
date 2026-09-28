/**
 * Playground for `steps-checklist`: the card's surface and the keys it answers.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move through the collapse button, each item's checkbox and the next item's action." },
    { keys: "Space / Enter on an item", does: "Check or uncheck it. A checked item folds to one line." },
    { keys: "Space / Enter on the chevron", does: "Collapse or open the whole list." },
  ],
  controls: [
    { prop: "title", label: "Title", kind: "text", default: "Get started", group: "Content" },
    { prop: "defaultOpen", label: "Open", kind: "switch", default: true, group: "Content" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "outline", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
