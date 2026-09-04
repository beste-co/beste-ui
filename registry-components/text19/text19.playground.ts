/**
 * Playground for `text19`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "before", label: "Before", kind: "text", placeholder: "Not" },
    { prop: "struck", label: "Struck word", kind: "text", placeholder: "fixed." },
    { prop: "replacement", label: "Replacement", kind: "text", placeholder: "heard." },
    { prop: "after", label: "After", kind: "text", placeholder: "ever" },
    { prop: "as", label: "Element", kind: "select", options: ["h1", "h2", "h3", "p", "span"], default: "p" },
    { prop: "trigger", label: "Trigger", kind: "segmented", options: ["view", "mount"], default: "view" },
    { prop: "delay", label: "Strike at", kind: "stepper", min: 0, max: 2, step: 0.05, default: 0.4, unit: "s", group: "Timing" },
  ],
};
