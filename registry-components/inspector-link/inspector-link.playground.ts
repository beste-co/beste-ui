/**
 * Playground for `inspector-link`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Link" },
    { prop: "placeholder", label: "Placeholder", kind: "text", placeholder: "https://" },
    { prop: "emptyLabel", label: "Empty label", kind: "text", placeholder: "No link" },
    { prop: "allowNofollow", label: "Offer nofollow", kind: "switch", default: false },
    ...SURFACE_CONTROLS,
  ],
};
