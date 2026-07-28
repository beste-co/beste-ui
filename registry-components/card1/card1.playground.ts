/**
 * Playground for `card1`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "title", label: "Title", kind: "text", placeholder: "Ship in minutes" },
    { prop: "description", label: "Description", kind: "text", placeholder: "Copy a block, wire up your content\u2026" },
    { prop: "linkLabel", label: "Link label", kind: "text", placeholder: "Learn more" },
    { prop: "tone", label: "Tone", kind: "select", options: ["primary", "foreground"], default: "primary", group: "Surface" },
  ],
};
