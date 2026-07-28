/**
 * Playground for `card26`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Hover", does: "The card lifts and the image scales inside its frame; `motion-reduce` turns the movement off." },
  ],
  controls: [
    { prop: "brand", label: "Brand", kind: "text", placeholder: "LUMO" },
    { prop: "subtitle", label: "Subtitle", kind: "text", placeholder: "Field Camera" },
    { prop: "status", label: "Status", kind: "text", placeholder: "Launching Friday" },
    { prop: "statusNote", label: "Status note", kind: "text", placeholder: "Join the waitlist" },
    { prop: "cta", label: "CTA", kind: "text", placeholder: "Join list" },
    { prop: "tone", label: "Tone", kind: "select", options: ["light", "primary"], default: "light", group: "Surface" },
  ],
};
