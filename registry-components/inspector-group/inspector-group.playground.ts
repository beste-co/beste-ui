/**
 * Playground for `inspector-group`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Enter / Space on the header", does: "Open or close the group. The header is a button whenever `collapsible` is on." },
  ],
  // A string child rather than the demo's rows: the snippet under the preview
  // has to stay something a reader could paste.
  props: { label: "Layout", summary: "16 24 px", children: "Rows of the family go here" },
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Layout" },
    { prop: "summary", label: "Summary", kind: "text", placeholder: "16 24 px" },
    { prop: "alwaysShowSummary", label: "Summary while open", kind: "switch", default: false },
    { prop: "defaultOpen", label: "Open", kind: "switch", default: true },
    { prop: "collapsible", label: "Collapsible", kind: "switch", default: true },
    { prop: "resetDisabled", label: "Reset disabled", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
