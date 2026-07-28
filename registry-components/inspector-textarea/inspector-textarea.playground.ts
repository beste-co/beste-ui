/**
 * Playground for `inspector-textarea`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Description" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "Write something…" },
    { prop: "rows", label: "Rows", kind: "stepper", min: 2, max: 20, default: 3 },
    { prop: "fixedHeight", label: "Fixed height", kind: "switch", default: false },
    { prop: "maxLength", label: "Max length", kind: "stepper", min: 20, max: 2000, default: 280 },
    { prop: "readOnly", label: "Read only", kind: "switch", default: false },
    { prop: "collapsible", label: "Collapsible", kind: "switch", default: false },
    { prop: "defaultOpen", label: "Open", kind: "switch", default: true },
    ...SURFACE_CONTROLS,
  ],
};
