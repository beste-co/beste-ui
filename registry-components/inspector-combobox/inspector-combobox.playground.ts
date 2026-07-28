/**
 * Playground for `inspector-combobox`: the props its documentation page lets a
 * reader turn, and every gesture it answers.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Link to" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "Choose" },
    { prop: "multiple", label: "Multiple", kind: "switch", default: false },
    { prop: "searchable", label: "Searchable", kind: "switch", default: true },
    { prop: "clearable", label: "Clearable", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
  keys: [
    { keys: "Down / Up", does: "Move through the results without leaving the search field" },
    { keys: "Home / End", does: "Jump to the first or last result" },
    { keys: "Enter", does: "Choose the active result" },
    { keys: "Escape", does: "Close the list, leaving the value alone" },
    { keys: "Typing", does: "Filters on the label, the value, the description and any keywords" },
  ],
};
