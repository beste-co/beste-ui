/**
 * Playground for `field-password`: what the field checks and how it looks.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Type", does: "The meter and the checklist update with every key; the strength is announced once typing settles." },
    { keys: "Eye button", does: "Shows or hides the password; with a pointer the caret stays where it was." },
    { keys: "Caps Lock", does: "A warning appears under the field while it has focus." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Password", group: "Field" },
    { prop: "autoComplete", label: "Purpose", kind: "segmented", options: [{ value: "new-password", label: "New" }, { value: "current-password", label: "Current" }], default: "new-password", group: "Field" },
    { prop: "minLength", label: "Min length", kind: "stepper", min: 6, max: 32, step: 1, default: 12, group: "Rules" },
    { prop: "minScore", label: "Min score", kind: "stepper", min: 0, max: 4, step: 1, default: 2, group: "Rules" },
    { prop: "showStrength", label: "Meter", kind: "switch", default: true, group: "Rules" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "outline", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false, group: "Surface" },
  ],
};
