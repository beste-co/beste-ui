/**
 * Playground for `price-toggle`: the periods, the surface and the keys the group answers.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Reach the group; focus lands on the picked period." },
    { keys: "Arrow keys", does: "Move to the other period and pick it, as in any radio group." },
  ],
  controls: [
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false, group: "Surface" },
  ],
};
