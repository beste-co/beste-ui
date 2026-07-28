/**
 * Playground for `card7`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Move the pointer over it", does: "The card tilts towards the cursor; `maxTilt` is how far it is willing to lean." },
  ],
  controls: [
    { prop: "eyebrow", label: "Eyebrow", kind: "text", placeholder: "Hardware" },
    { prop: "title", label: "Title", kind: "text", placeholder: "Meet the Atlas" },
    { prop: "description", label: "Description", kind: "text", placeholder: "Machined from a single billet." },
    { prop: "maxTilt", label: "Max tilt", kind: "stepper", min: 0, max: 20, default: 8, unit: "\u00b0" },
    { prop: "tone", label: "Tone", kind: "select", options: ["primary", "foreground"], default: "primary", group: "Surface" },
  ],
};
