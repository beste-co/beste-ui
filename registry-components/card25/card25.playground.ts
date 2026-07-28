/**
 * Playground for `card25`: the props its documentation page lets a reader turn,
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
    { prop: "name", label: "Name", kind: "text", placeholder: "Orbit One" },
    { prop: "price", label: "Price", kind: "text", placeholder: "$189" },
    { prop: "cta", label: "CTA", kind: "text", placeholder: "Shop now" },
    { prop: "tone", label: "Tone", kind: "select", options: ["light", "primary"], default: "light", group: "Surface" },
  ],
};
