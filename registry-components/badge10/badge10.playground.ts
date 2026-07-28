/**
 * Playground for `badge10`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Open for work \u2022 " },
    { prop: "size", label: "Size", kind: "stepper", min: 60, max: 240, default: 120, unit: "px" },
    { prop: "duration", label: "Duration", kind: "stepper", min: 5, max: 60, default: 20, unit: "s" },
    { prop: "tone", label: "Tone", kind: "select", options: ["foreground", "muted", "primary"], default: "foreground", group: "Surface" },
  ],
};
