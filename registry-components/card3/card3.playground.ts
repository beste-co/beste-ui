/**
 * Playground for `card3`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "quote", label: "Quote", kind: "text", placeholder: "We rebuilt our marketing site in a weekend." },
    { prop: "name", label: "Name", kind: "text", placeholder: "Mary Pollock" },
    { prop: "role", label: "Role", kind: "text", placeholder: "Founder, Nordwind" },
    { prop: "rating", label: "Rating", kind: "stepper", min: 0, max: 5, default: 5 },
    { prop: "tone", label: "Tone", kind: "select", options: ["neutral", "muted"], default: "neutral", group: "Surface" },
  ],
};
