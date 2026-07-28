/**
 * Playground for `card8`: the props its documentation page lets a reader turn,
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
    { prop: "name", label: "Name", kind: "text", placeholder: "Deniz Arslan" },
    { prop: "role", label: "Role", kind: "text", placeholder: "Creative Director" },
    { prop: "bio", label: "Bio", kind: "text", placeholder: "Fifteen years of brand work." },
    { prop: "linkLabel", label: "Link label", kind: "text", placeholder: "Read profile" },
    { prop: "colored", label: "Coloured", kind: "switch", default: false },
    { prop: "tone", label: "Tone", kind: "select", options: ["primary", "foreground"], default: "primary", group: "Surface" },
  ],
};
