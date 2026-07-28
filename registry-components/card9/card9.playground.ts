/**
 * Playground for `card9`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "badge", label: "Badge", kind: "text", placeholder: "Featured" },
    { prop: "title", label: "Title", kind: "text", placeholder: "Pro blocks drop monthly" },
    { prop: "description", label: "Description", kind: "text", placeholder: "A new themed set lands every month." },
    { prop: "linkLabel", label: "Link label", kind: "text", placeholder: "See the sets" },
    { prop: "tone", label: "Tone", kind: "select", options: ["primary", "aurora"], default: "primary", group: "Surface" },
  ],
};
