/**
 * Playground for `card5`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hover", does: "The card lifts and the image scales inside its frame; `motion-reduce` turns the movement off." },
  ],
  controls: [
    { prop: "category", label: "Category", kind: "text", placeholder: "Engineering" },
    { prop: "title", label: "Title", kind: "text", placeholder: "Shipping faster with blocks" },
    { prop: "excerpt", label: "Excerpt", kind: "text", placeholder: "How we cut our build time in half." },
    { prop: "authorName", label: "Author", kind: "text", placeholder: "Selin Aksoy" },
    { prop: "date", label: "Date", kind: "text", placeholder: "Jul 2, 2026" },
    { prop: "readTime", label: "Read time", kind: "text", placeholder: "6 min read" },
    { prop: "tone", label: "Tone", kind: "select", options: ["primary", "foreground"], default: "primary", group: "Surface" },
  ],
};
