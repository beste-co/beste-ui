/**
 * Playground for `chat-bubble`: how the conversation groups and how the bubbles look.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Up / Down", does: "Moves between messages once one is focused, showing its time." },
    { keys: "Home / End", does: "Jumps to the first or last message." },
  ],
  controls: [
    { prop: "showNames", label: "Names", kind: "switch", default: true, group: "Conversation" },
    { prop: "groupWithin", label: "Group within", kind: "slider", min: 0, max: 30, step: 1, default: 5, unit: "min", group: "Conversation" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
