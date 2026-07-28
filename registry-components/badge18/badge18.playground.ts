/**
 * Playground for `badge18`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "target", label: "Target", kind: "text", placeholder: "2027-01-01T00:00:00Z" },
    { prop: "label", label: "Label", kind: "text", placeholder: "Launch in" },
    { prop: "finishedText", label: "Finished text", kind: "text", placeholder: "Live" },
    { prop: "tone", label: "Tone", kind: "select", options: ["foreground", "primary"], default: "foreground", group: "Surface" },
  ],
};
