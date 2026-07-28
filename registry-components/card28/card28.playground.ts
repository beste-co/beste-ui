/**
 * Playground for `card28`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "The dismiss button", does: "Takes the card off the page unless `permanent` is set, and calls `onDismiss` so the page can remember." },
  ],
  controls: [
    { prop: "title", label: "Title", kind: "text", placeholder: "Join the beta program" },
    { prop: "description", label: "Description", kind: "text", placeholder: "Early access to everything we ship." },
    { prop: "highlight", label: "Highlight", kind: "text", placeholder: "Free for 3 months" },
    { prop: "note", label: "Note", kind: "text", placeholder: "No card needed" },
    { prop: "cta", label: "CTA", kind: "text", placeholder: "Request access" },
    { prop: "permanent", label: "Permanent", kind: "switch", default: false },
    { prop: "tone", label: "Tone", kind: "select", options: ["primary", "dark"], default: "primary", group: "Surface" },
  ],
};
