/**
 * Playground for `button17`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Click", does: "Copies the value and says so; the label goes back after `resetDelay`." },
  ],
  controls: [
    { prop: "value", label: "Value", kind: "text", placeholder: "npx shadcn@latest init" },
    { prop: "prefix", label: "Prefix", kind: "text", placeholder: "$" },
    { prop: "label", label: "Label", kind: "text", placeholder: "Copy" },
    { prop: "resetDelay", label: "Reset delay", kind: "stepper", min: 500, max: 6000, default: 2000, step: 100, unit: "ms" },
    { prop: "tone", label: "Tone", kind: "select", options: ["neutral", "dark"], default: "neutral", group: "Surface" },
  ],
};
