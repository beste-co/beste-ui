/**
 * Playground for `card4`: the props its documentation page lets a reader turn,
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
    { prop: "name", label: "Name", kind: "text", placeholder: "Atlas Field Watch" },
    { prop: "price", label: "Price", kind: "text", placeholder: "$249" },
    { prop: "compareAt", label: "Compare at", kind: "text", placeholder: "$319" },
    { prop: "badge", label: "Badge", kind: "text", placeholder: "New" },
    { prop: "ctaLabel", label: "CTA label", kind: "text", placeholder: "Add to cart" },
    { prop: "rating", label: "Rating", kind: "stepper", min: 0, max: 5, default: 4, step: 0.5 },
    { prop: "tone", label: "Tone", kind: "select", options: ["dark", "primary"], default: "dark", group: "Surface" },
  ],
};
