/**
 * Playground for `scroll-toc`: how the list follows the content beside it.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Scroll the article", does: "The marker slides to the section whose heading last passed the line near the top." },
    { keys: "Click an entry", does: "Scrolls to its heading and moves focus there." },
    { keys: "Tab", does: "Moves through the entries; collapsed ones are skipped." },
  ],
  controls: [
    { prop: "title", label: "Title", kind: "text", placeholder: "On this page", group: "Content" },
    { prop: "collapse", label: "Collapse levels", kind: "switch", default: false, group: "Behavior" },
    { prop: "smooth", label: "Smooth scroll", kind: "switch", default: true, group: "Behavior" },
    { prop: "offset", label: "Offset", kind: "slider", min: 0, max: 200, step: 4, default: 96, unit: "px", group: "Behavior" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "ghost", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
