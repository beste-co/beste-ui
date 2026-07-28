/**
 * Playground for `card11`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "eyebrow", label: "Eyebrow", kind: "text", placeholder: "Admit one" },
    { prop: "event", label: "Event", kind: "text", placeholder: "Beste Conf 2027" },
    { prop: "holder", label: "Holder", kind: "text", placeholder: "Selin Aksoy" },
    { prop: "code", label: "Code", kind: "text", placeholder: "BST-0421" },
    { prop: "tone", label: "Tone", kind: "select", options: ["dark", "primary", "neutral"], default: "dark", group: "Surface" },
  ],
};
