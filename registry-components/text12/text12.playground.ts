/**
 * Playground for `text12`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Altair" },
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "span"], default: "span" },
    { prop: "amplitude", label: "Wave height", kind: "stepper", min: 0, max: 0.4, step: 0.01, default: 0.08, unit: "em" },
    { prop: "period", label: "Per swell", kind: "stepper", min: 1, max: 12, step: 0.5, default: 4, unit: "s", group: "Timing" },
  ],
};
