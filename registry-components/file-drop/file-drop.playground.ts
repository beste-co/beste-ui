/**
 * Playground for `file-drop`: the limits, the copy and the surface.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "title", label: "Title", kind: "text", placeholder: "Drop files here or browse" },
    { prop: "multiple", label: "Multiple", kind: "switch", default: true },
    { prop: "maxFiles", label: "Max files", kind: "stepper", min: 1, max: 20, step: 1 },
    { prop: "paste", label: "Paste", kind: "switch", default: false },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
  keys: [
    { keys: "Enter / Space", does: "Open the file browser from the focused zone" },
    { keys: "Ctrl / Cmd + V", does: "Add pasted files when paste is on" },
    { keys: "Drag and drop", does: "Add files dropped on the zone" },
  ],
};
