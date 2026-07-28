/**
 * Playground for `badge9`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "value", label: "Value", kind: "text", placeholder: "+12.4%" },
    { prop: "label", label: "Label", kind: "text", placeholder: "vs last month" },
    { prop: "tone", label: "Tone", kind: "select", options: ["up", "down", "flat"], default: "up", group: "Surface" },
  ],
};
