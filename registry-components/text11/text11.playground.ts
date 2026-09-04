/**
 * Playground for `text11`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Slow, on purpose." },
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "span"], default: "p" },
    { prop: "trigger", label: "Trigger", kind: "segmented", options: ["view", "mount"], default: "view" },
    { prop: "delay", label: "Delay", kind: "stepper", min: 0, max: 2, step: 0.05, default: 0.1, unit: "s", group: "Timing" },
    { prop: "stagger", label: "Between words", kind: "stepper", min: 0, max: 0.6, step: 0.02, default: 0.12, unit: "s", group: "Timing" },
    { prop: "duration", label: "Drying", kind: "stepper", min: 0.4, max: 4, step: 0.1, default: 1.6, unit: "s", group: "Timing" },
  ],
};
