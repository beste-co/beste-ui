/**
 * Playground for `card20`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "step", label: "Step", kind: "text", placeholder: "01" },
    { prop: "title", label: "Title", kind: "text", placeholder: "Pick a block" },
    { prop: "description", label: "Description", kind: "text", placeholder: "Browse 1,400+ sections." },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "primary"], default: "muted", group: "Surface" },
  ],
};
