/**
 * Playground for `card24`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "eyebrow", label: "Eyebrow", kind: "text", placeholder: "Ready when you are" },
    { prop: "title", label: "Title", kind: "text", placeholder: "Start building today" },
    { prop: "description", label: "Description", kind: "text", placeholder: "Copy your first block in under a minute." },
    { prop: "cta", label: "CTA", kind: "text", placeholder: "Browse blocks" },
    { prop: "secondaryCta", label: "Secondary CTA", kind: "text", placeholder: "See pricing" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "dark", "primary"], default: "muted", group: "Surface" },
  ],
};
