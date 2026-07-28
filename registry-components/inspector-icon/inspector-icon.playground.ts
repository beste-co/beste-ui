/**
 * Playground for `inspector-icon`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Icon" },
    { prop: "columns", label: "Columns", kind: "stepper", min: 3, max: 10, default: 6 },
    { prop: "searchable", label: "Searchable", kind: "switch", default: true },
    { prop: "clearable", label: "Clearable", kind: "switch", default: false },
    { prop: "emptyMessage", label: "Empty message", kind: "text", placeholder: "No icons found" },
    ...SURFACE_CONTROLS,
  ],
};
