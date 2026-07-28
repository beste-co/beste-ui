/**
 * Playground for `badge21`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "tag", label: "Tag", kind: "text", placeholder: "New" },
    { prop: "text", label: "Text", kind: "text", placeholder: "The Auralis studio set is live" },
    { prop: "tone", label: "Tone", kind: "select", options: ["primary", "foreground"], default: "primary", group: "Surface" },
  ],
};
