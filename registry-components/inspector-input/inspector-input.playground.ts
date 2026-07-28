/**
 * Playground for `inspector-input`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Enter", does: "Commit the value. It does not submit the surrounding form: a settings row is rarely the only field in one." },
    { keys: "Escape", does: "Put the last committed value back." },
  ],
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Class name" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "hero-section" },
    {
      prop: "type",
      label: "Type",
      kind: "select",
      options: ["text", "number", "email", "url", "tel", "password", "search"],
      default: "text",
    },
    { prop: "suffix", label: "Suffix", kind: "text", placeholder: "px" },
    { prop: "align", label: "Align", kind: "segmented", options: ["start", "end"], default: "end" },
    { prop: "readOnly", label: "Read only", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
