/**
 * Playground for `card14`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "store", label: "Store", kind: "text", placeholder: "Beste Studio" },
    { prop: "meta", label: "Meta", kind: "text", placeholder: "INV-2026-0142" },
    { prop: "total", label: "Total", kind: "text", placeholder: "$4,650" },
    { prop: "totalLabel", label: "Total label", kind: "text", placeholder: "Total" },
    { prop: "note", label: "Note", kind: "text", placeholder: "Thanks for your business" },
    { prop: "code", label: "Code", kind: "text", placeholder: "BST-0142" },
    { prop: "tilted", label: "Tilted", kind: "switch", default: false },
    { prop: "tone", label: "Tone", kind: "select", options: ["ink", "primary"], default: "ink", group: "Surface" },
  ],
};
