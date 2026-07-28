/**
 * Playground for `filter-combobox`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Type anything", does: "Filters the list as you go; the first match stays highlighted." },
    { keys: "Arrow keys", does: "Move through what is left after the filter." },
    { keys: "Enter", does: "Toggle the highlighted option." },
    { keys: "Escape", does: "Close the popover and leave the selection as it is." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Brand" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "All brands" },
    { prop: "searchPlaceholder", label: "Search placeholder", kind: "text", placeholder: "Search brands" },
    { prop: "emptyText", label: "Empty text", kind: "text", placeholder: "No results" },
    { prop: "multiple", label: "Multiple", kind: "switch", default: true },
    { prop: "disabled", label: "Disabled", kind: "switch", default: false },
  ],
};
