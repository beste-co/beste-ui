/**
 * Playground for `steps-track`: where the progress stands and how the track is laid out.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Reach each pressable step in order; the others are plain text." },
    { keys: "Enter / Space", does: "Jump to the focused step through `onStepClick`." },
  ],
  controls: [
    { prop: "current", label: "Current", kind: "stepper", min: 0, max: 4, step: 1, default: 2, group: "Progress" },
    { prop: "orientation", label: "Layout", kind: "segmented", options: ["horizontal", "vertical"], default: "horizontal", group: "Progress" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "ghost", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
