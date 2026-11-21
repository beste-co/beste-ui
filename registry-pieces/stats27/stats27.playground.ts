/** Playground for `stats27`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", group: "Content" },
    { prop: "value", label: "Value", kind: "text", group: "Content" },
    { prop: "note", label: "Note", kind: "text", group: "Content" },
    { prop: "surface", label: "Surface", kind: "segmented", options: [{ value: "primary", label: "Primary" }, { value: "muted", label: "Muted" }, { value: "card", label: "Card" }, { value: "none", label: "None" }], default: "primary", group: "Surface" },
  ],
};
