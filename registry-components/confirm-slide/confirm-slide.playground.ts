/**
 * Playground for `confirm-slide`: the labels, when it resets and every key it answers.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Drag the thumb", does: "Slide it to the end, or flick it past halfway, to confirm. Letting go earlier springs it back." },
    { keys: "Hold Right arrow", does: "Slides the thumb through on key repeat; releasing the key early springs it back." },
    { keys: "End, Enter or Space", does: "Confirm at once, the path for assistive technology." },
    { keys: "Left arrow or Home", does: "Send the thumb back to the start." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", group: "Labels" },
    { prop: "confirmedLabel", label: "Confirmed", kind: "text", default: "Done", group: "Labels" },
    { prop: "resetAfter", label: "Reset after", kind: "slider", min: 600, max: 5000, step: 100, default: 1800, unit: "ms", group: "Behavior" },
    { prop: "tone", label: "Tone", kind: "segmented", options: ["default", "destructive"], default: "default", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false, group: "Surface" },
  ],
};
