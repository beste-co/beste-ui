/**
 * Playground for `button4`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Open case study" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "md", "lg"], default: "md", group: "Surface" },
    { prop: "rounded", label: "Rounded", kind: "segmented", options: ["full", "md"], default: "full", group: "Surface" },
    { prop: "tone", label: "Tone", kind: "select", options: ["neutral", "dark", "primary"], default: "neutral", group: "Surface" },
  ],
};
