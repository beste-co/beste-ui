/**
 * Playground for `snippet-install`: what is installed, how, and how the block looks.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Left / Right", does: "Moves between package managers while a tab is focused." },
    { keys: "Home / End", does: "Jumps to the first or last package manager." },
  ],
  controls: [
    { prop: "packages", label: "Packages", kind: "text", placeholder: "motion lucide-react", group: "Command" },
    { prop: "kind", label: "Kind", kind: "segmented", options: ["add", "exec"], default: "add", group: "Command" },
    { prop: "dev", label: "Dev", kind: "switch", default: false, group: "Command" },
    { prop: "prompt", label: "Prompt", kind: "switch", default: true, group: "Command" },
    { prop: "remember", label: "Remember pick", kind: "switch", default: true, group: "Command" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
