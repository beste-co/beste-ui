/** Playground for `progress22`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "level", label: "Level", kind: "slider", min: 0, max: 100, step: 1, unit: "%", group: "Content" },
    { prop: "value", label: "Value", kind: "text", group: "Content" },
    { prop: "note", label: "Note", kind: "text", group: "Content" },
    { prop: "tone", label: "Fill", kind: "segmented", options: [{ value: "secondary", label: "Secondary" }, { value: "primary", label: "Primary" }], default: "secondary", group: "Surface" },
  ],
};
