/**
 * Playground for `text18`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Altair \u00b7 Lisbon \u00b7 since 2019 \u00b7 " },
    { prop: "size", label: "Diameter", kind: "stepper", min: 80, max: 320, step: 10, default: 200, unit: "px" },
    { prop: "direction", label: "Direction", kind: "segmented", options: ["clockwise", "counter"], default: "clockwise" },
    { prop: "duration", label: "Per turn", kind: "stepper", min: 0, max: 60, default: 24, unit: "s", group: "Timing" },
  ],
};
