/**
 * Playground for `card27`: the props its documentation page lets a reader turn,
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
    { prop: "title", label: "Title", kind: "text", placeholder: "Night Shippers" },
    { prop: "meta", label: "Meta", kind: "text", placeholder: "312 members" },
    { prop: "byName", label: "By", kind: "text", placeholder: "Deniz" },
    { prop: "tone", label: "Tone", kind: "select", options: ["peach", "violet", "emerald"], default: "peach", group: "Surface" },
  ],
};
