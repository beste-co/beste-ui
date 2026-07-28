/**
 * Playground for `inspector-tags`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Enter", does: "Add what is in the field. It does not submit the surrounding form." },
    { keys: "Comma, or a paste", does: "Splits into several tags at once, trimmed and deduped against the list." },
    { keys: "Backspace on an empty field", does: "Reach back and take the last tag off." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Keywords" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "Add a keyword" },
    { prop: "max", label: "Max tags", kind: "stepper", min: 1, max: 20, default: 6 },
    { prop: "maxLength", label: "Max length", kind: "stepper", min: 1, max: 80, default: 32 },
    { prop: "allowDuplicates", label: "Allow duplicates", kind: "switch", default: false },
    { prop: "caseSensitive", label: "Case sensitive", kind: "switch", default: false },
    { prop: "collapsible", label: "Collapsible", kind: "switch", default: false },
    { prop: "defaultOpen", label: "Open", kind: "switch", default: true },
    ...SURFACE_CONTROLS,
  ],
};
