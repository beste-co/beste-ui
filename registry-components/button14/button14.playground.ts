/**
 * Playground for `button14`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Press and hold", does: "The fill crosses the button over `holdDuration`; only when it lands does `onConfirm` run." },
    { keys: "Release early", does: "The fill runs back and nothing is confirmed. That is the whole point of the control." },
    { keys: "Space / Enter held", does: "Holds the same way, so the keyboard is not offered a shortcut past the pause." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Hold to delete" },
    { prop: "confirmLabel", label: "Confirmed label", kind: "text", placeholder: "Deleted" },
    { prop: "holdDuration", label: "Hold duration", kind: "stepper", min: 400, max: 4000, default: 1200, step: 100, unit: "ms" },
    { prop: "resetDelay", label: "Reset delay", kind: "stepper", min: 500, max: 6000, default: 2000, step: 100, unit: "ms" },
    { prop: "rounded", label: "Rounded", kind: "select", options: ["full", "lg", "md", "none"], default: "full", group: "Surface" },
    { prop: "tone", label: "Tone", kind: "select", options: ["destructive", "dark", "primary"], default: "destructive", group: "Surface" },
  ],
};
