/**
 * Playground for `badge11`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", placeholder: "Est. 2019, Berlin" },
    { prop: "bars", label: "Bars", kind: "stepper", min: 3, max: 12, default: 5 },
    { prop: "hideLabel", label: "Hide label", kind: "switch", default: false },
    { prop: "tone", label: "Tone", kind: "select", options: ["foreground", "muted", "primary"], default: "foreground", group: "Surface" },
  ],
};
