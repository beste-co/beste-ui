/**
 * Playground for `kbd-combo`: the shortcut, how it reads and whether it listens.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hold the keys shown", does: "With Live on, each cap presses down while its key is held." },
    { keys: "Press the whole shortcut", does: "The caps glow for a moment, and onTrigger fires if one is given." },
  ],
  props: { keys: "mod+k", live: true, size: "lg" },
  controls: [
    { prop: "keys", label: "Keys", kind: "text", placeholder: "mod+shift+k", group: "Shortcut" },
    { prop: "sequence", label: "Sequence", kind: "switch", default: false, group: "Shortcut" },
    { prop: "separator", label: "Separator", kind: "segmented", options: ["none", "plus", "then"], group: "Shortcut" },
    { prop: "live", label: "Live", kind: "switch", default: false, group: "Shortcut" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
