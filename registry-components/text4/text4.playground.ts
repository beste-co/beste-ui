/**
 * Playground for `text4`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "before", label: "Before", kind: "text", placeholder: "Room to" },
    { prop: "after", label: "After", kind: "text", placeholder: "today" },
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "span"], default: "p" },
    { prop: "trigger", label: "Trigger", kind: "segmented", options: ["view", "mount"], default: "view" },
    { prop: "interval", label: "Per word", kind: "stepper", min: 800, max: 8000, step: 100, default: 2800, unit: "ms", group: "Timing" },
  ],
};
