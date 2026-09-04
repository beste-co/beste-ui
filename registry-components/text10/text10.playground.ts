/**
 * Playground for `text10`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Scroll the page", does: "The photograph travels inside the letters; the type itself never moves." },
  ],
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Breathe" },
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "span"], default: "span" },
    { prop: "drift", label: "Drift", kind: "stepper", min: 0, max: 100, step: 5, default: 30, unit: "%" },
  ],
};
