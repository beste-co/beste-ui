/**
 * Playground for `card23`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "name", label: "Name", kind: "text", placeholder: "Deniz Arslan" },
    { prop: "role", label: "Role", kind: "text", placeholder: "Creative Director" },
    { prop: "company", label: "Company", kind: "text", placeholder: "Beste Conf 2027" },
    { prop: "tag", label: "Tag", kind: "text", placeholder: "Speaker" },
    { prop: "code", label: "Code", kind: "text", placeholder: "ATT-0087" },
    { prop: "tone", label: "Tone", kind: "select", options: ["primary", "emerald", "rose"], default: "primary", group: "Surface" },
  ],
};
