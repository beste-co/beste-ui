/**
 * Playground for `button20`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Move the pointer near it", does: "The button leans towards the cursor; `strength` is how far it is willing to go." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Let's talk" },
    { prop: "strength", label: "Strength", kind: "stepper", min: 0, max: 60, default: 18, unit: "px" },
    { prop: "tone", label: "Tone", kind: "select", options: ["dark", "primary"], default: "dark", group: "Surface" },
  ],
};
