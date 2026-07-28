/**
 * Playground for `card12`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "caption", label: "Caption", kind: "text", placeholder: "Summer in Alacati" },
    { prop: "date", label: "Date", kind: "text", placeholder: "Aug 2026" },
    { prop: "untaped", label: "Untaped", kind: "switch", default: false },
    { prop: "tone", label: "Tone", kind: "select", options: ["sand", "sky", "rose"], default: "sand", group: "Surface" },
  ],
};
