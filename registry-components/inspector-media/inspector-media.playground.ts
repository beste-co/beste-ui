/**
 * Playground for `inspector-media`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Background" },
    { prop: "kind", label: "Kind", kind: "segmented", options: ["image", "video"], default: "image" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "Paste a URL" },
    { prop: "clearable", label: "Clearable", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
