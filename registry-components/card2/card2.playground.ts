/**
 * Playground for `card2`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "plan", label: "Plan", kind: "text", placeholder: "Pro" },
    { prop: "price", label: "Price", kind: "text", placeholder: "$19" },
    { prop: "period", label: "Period", kind: "text", placeholder: "/month" },
    { prop: "description", label: "Description", kind: "text", placeholder: "For freelancers shipping client sites." },
    { prop: "cta", label: "CTA", kind: "text", placeholder: "Get started" },
    { prop: "badge", label: "Badge", kind: "text", placeholder: "Most popular" },
    { prop: "footnote", label: "Footnote", kind: "text", placeholder: "Cancel any time" },
    { prop: "highlighted", label: "Highlighted", kind: "switch", default: false },
    { prop: "tone", label: "Tone", kind: "select", options: ["primary", "dark"], default: "primary", group: "Surface" },
  ],
};
