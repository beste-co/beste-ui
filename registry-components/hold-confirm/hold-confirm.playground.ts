/**
 * Playground for `hold-confirm`: the labels, how long the hold is and every key it answers.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Press and hold", does: "Fills the button. Letting go early rewinds it." },
    { keys: "Hold Space or Enter", does: "The same hold from the keyboard; releasing the key lets go." },
    { keys: "Activate with a screen reader", does: "Confirms at once while Accessible fallback is on, since a hold cannot be performed." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", group: "Labels" },
    { prop: "holdingLabel", label: "While holding", kind: "text", group: "Labels" },
    { prop: "confirmedLabel", label: "Confirmed", kind: "text", default: "Done", group: "Labels" },
    { prop: "duration", label: "Duration", kind: "slider", min: 400, max: 3000, step: 100, default: 1200, unit: "ms", group: "Hold" },
    { prop: "resetAfter", label: "Reset after", kind: "slider", min: 600, max: 5000, step: 100, default: 1800, unit: "ms", group: "Hold" },
    { prop: "accessibleFallback", label: "Accessible fallback", kind: "switch", default: true, group: "Hold" },
    { prop: "tone", label: "Tone", kind: "segmented", options: ["default", "destructive"], default: "default", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false, group: "Surface" },
  ],
};
