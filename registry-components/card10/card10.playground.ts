/**
 * Playground for `card10`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "title", label: "Title", kind: "text", placeholder: "beste ~ zsh" },
    { prop: "tone", label: "Tone", kind: "select", options: ["dark", "midnight"], default: "dark", group: "Surface" },
  ],
};
