/**
 * Playground for `inspector-code`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Inserts an indent instead of leaving the field, which is what a code box has to do." },
    { keys: "Escape", does: "Blurs the field, so the drawer around it gets the keyboard back." },
    { keys: "The header", does: "Folds the block away while collapsible, leaving the label and the line count." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Custom CSS" },
    { prop: "language", label: "Language", kind: "text", placeholder: "css" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "Write CSS…" },
    { prop: "rows", label: "Rows", kind: "stepper", min: 2, max: 24, default: 6 },
    { prop: "wrap", label: "Wrap", kind: "switch", default: false },
    { prop: "readOnly", label: "Read only", kind: "switch", default: false },
    { prop: "collapsible", label: "Collapsible", kind: "switch", default: false },
    { prop: "defaultOpen", label: "Open", kind: "switch", default: true },
    ...SURFACE_CONTROLS,
  ],
};
