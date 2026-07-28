/**
 * Playground for `card15`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "message", label: "Message", kind: "text", placeholder: "Wish you were here." },
    { prop: "sender", label: "Sender", kind: "text", placeholder: "Selin" },
    { prop: "to", label: "To", kind: "text", placeholder: "The Beste team" },
    { prop: "location", label: "Location", kind: "text", placeholder: "Alacati, TR" },
    { prop: "tone", label: "Tone", kind: "select", options: ["sand", "sky", "rose"], default: "sand", group: "Surface" },
  ],
};
