/**
 * Playground for `code-share`: the link, the card and which buttons it offers.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab to the link", does: "Selects the whole address, ready to copy by hand." },
    { keys: "Enter on copy", does: "Copies the link; the icon turns into a check and it is announced." },
  ],
  controls: [
    { prop: "url", label: "URL", kind: "text", group: "Share" },
    { prop: "title", label: "Title", kind: "text", group: "Share" },
    { prop: "showShare", label: "Share button", kind: "switch", default: true, group: "Share" },
    { prop: "showDownload", label: "Download button", kind: "switch", default: true, group: "Share" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "outline", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
