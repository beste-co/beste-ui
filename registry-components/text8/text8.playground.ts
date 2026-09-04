/**
 * Playground for `text8`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Phrase", kind: "text", placeholder: "listened to the end" },
    { prop: "trigger", label: "Trigger", kind: "segmented", options: ["view", "mount"], default: "view" },
    { prop: "offset", label: "Gap under text", kind: "stepper", min: 0, max: 1, step: 0.02, default: 0.18, unit: "em" },
    { prop: "thickness", label: "Thickness", kind: "stepper", min: 1, max: 8, default: 1, unit: "px" },
    { prop: "delay", label: "Delay", kind: "stepper", min: 0, max: 2, step: 0.05, default: 0.3, unit: "s", group: "Timing" },
    { prop: "duration", label: "Draw", kind: "stepper", min: 0.2, max: 3, step: 0.1, default: 1.2, unit: "s", group: "Timing" },
  ],
};
