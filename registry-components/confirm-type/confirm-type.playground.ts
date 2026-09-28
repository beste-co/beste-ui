/**
 * Playground for `confirm-type`: the name to type, the labels and how strict the match is.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Type", does: "Matching letters tint; the first letter that departs from the name is underlined." },
    { keys: "Enter", does: "Confirms on an exact match, and shakes the field otherwise." },
  ],
  controls: [
    { prop: "name", label: "Name", kind: "text", group: "Content" },
    { prop: "confirmLabel", label: "Button", kind: "text", default: "Confirm", group: "Content" },
    { prop: "doneLabel", label: "Done", kind: "text", default: "Done", group: "Content" },
    { prop: "caseSensitive", label: "Case sensitive", kind: "switch", default: true, group: "Match" },
    { prop: "tone", label: "Tone", kind: "segmented", options: ["default", "destructive"], default: "destructive", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false, group: "Surface" },
  ],
};
