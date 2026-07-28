/**
 * Playground for `badge16`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "name", label: "Name", kind: "text", placeholder: "Selin Aksoy" },
    { prop: "role", label: "Role", kind: "text", placeholder: "Product Designer" },
    { prop: "src", label: "Photo URL", kind: "text", placeholder: "https://\u2026" },
    { prop: "tone", label: "Tone", kind: "select", options: ["neutral", "muted"], default: "neutral", group: "Surface" },
  ],
};
