/**
 * Playground for `badge13`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "40% faster" },
    { prop: "tone", label: "Tone", kind: "select", options: ["amber", "emerald", "pink", "sky"], default: "amber", group: "Surface" },
  ],
};
