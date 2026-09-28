/**
 * Playground for `reaction-bar`: the pills' surface and size, and how many names the tooltip lists.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move between the pills and the \"+\" button." },
    { keys: "Enter / Space", does: "Add or remove your reaction on the focused pill, or open the emoji grid." },
  ],
  controls: [
    { prop: "maxNames", label: "Names shown", kind: "stepper", min: 1, max: 5, step: 1, default: 3, group: "Tooltip" },
    { prop: "youLabel", label: "You label", kind: "text", placeholder: "You", group: "Tooltip" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
