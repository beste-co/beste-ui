/**
 * Playground for `text6`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Come as you are." },
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "span"], default: "p" },
    { prop: "trigger", label: "Trigger", kind: "segmented", options: ["view", "mount"], default: "view" },
    { prop: "caret", label: "Keep the caret", kind: "switch", default: true },
    { prop: "speed", label: "Per character", kind: "stepper", min: 10, max: 200, step: 5, default: 45, unit: "ms", group: "Timing" },
    { prop: "delay", label: "Delay", kind: "stepper", min: 0, max: 2000, step: 50, default: 200, unit: "ms", group: "Timing" },
  ],
};
