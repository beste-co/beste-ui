/**
 * Playground for `badge12`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "value", label: "Value", kind: "stepper", min: 0, max: 5, default: 4.9, step: 0.1 },
    { prop: "text", label: "Text", kind: "text", placeholder: "from 200+ reviews" },
    { prop: "showValue", label: "Show value", kind: "switch", default: true },
    { prop: "tone", label: "Tone", kind: "select", options: ["amber", "primary", "foreground"], default: "amber", group: "Surface" },
  ],
};
