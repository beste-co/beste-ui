/**
 * Playground for `text13`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "The fog lifts a little later each morning." },
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "blockquote"], default: "p" },
    { prop: "trigger", label: "Trigger", kind: "segmented", options: ["view", "mount"], default: "view" },
    { prop: "softness", label: "Soft edge", kind: "stepper", min: 0, max: 100, step: 5, default: 35, unit: "%" },
    { prop: "delay", label: "Delay", kind: "stepper", min: 0, max: 2, step: 0.05, default: 0.2, unit: "s", group: "Timing" },
    { prop: "duration", label: "Clearing", kind: "stepper", min: 0.4, max: 6, step: 0.1, default: 2.2, unit: "s", group: "Timing" },
  ],
};
