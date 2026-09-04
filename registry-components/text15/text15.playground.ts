/**
 * Playground for `text15`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hover the line", does: "The run pauses while the pointer is over it, so a link or a long announcement can be read." },
  ],
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Therapy and coaching, in the room or online" },
    { prop: "separator", label: "Separator", kind: "text", placeholder: "\u00b7", default: "\u00b7" },
    { prop: "direction", label: "Direction", kind: "segmented", options: ["left", "right"], default: "left" },
    { prop: "pauseOnHover", label: "Pause on hover", kind: "switch", default: true },
    { prop: "duration", label: "Per pass", kind: "stepper", min: 5, max: 90, default: 28, unit: "s", group: "Timing" },
  ],
};
