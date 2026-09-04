/**
 * Playground for `text5`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Scroll the page", does: "Words brighten in reading order as the passage crosses the viewport, and dim again on the way back." },
  ],
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Progress rarely feels like progress\u2026" },
    { prop: "as", label: "Element", kind: "select", options: ["h2", "h3", "p", "blockquote"], default: "p" },
    { prop: "dim", label: "Dimmed to", kind: "stepper", min: 0, max: 0.8, step: 0.05, default: 0.2 },
  ],
};
