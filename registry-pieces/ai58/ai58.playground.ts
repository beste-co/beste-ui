/** Playground for `ai58`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    {
      prop: "agent",
      label: "Agent",
      kind: "select",
      options: [
        { value: "claude", label: "Claude" },
        { value: "openai", label: "ChatGPT" },
        { value: "cursor", label: "Cursor" },
        { value: "grok", label: "Grok" },
        { value: "gemini", label: "Gemini" },
        { value: "bestie", label: "Bestie" },
      ],
      default: "claude",
      group: "Content",
    },
    { prop: "name", label: "Name", kind: "text", group: "Content" },
    { prop: "via", label: "Via", kind: "text", group: "Content" },
    { prop: "code", label: "Code", kind: "text", placeholder: "Empty shows the link row", group: "Content" },
    { prop: "action", label: "Link text", kind: "text", group: "Content" },
    { prop: "note", label: "Note", kind: "text", group: "Content" },
    { prop: "framed", label: "Framed", kind: "switch", default: true, group: "Surface" },
    { prop: "fill", label: "Fill", kind: "switch", default: false, group: "Surface" },
  ],
};
