/**
 * Playground for `badge17`: the props its documentation page lets a reader turn,
 * and every gesture it answers.
 *
 * It sits beside the component rather than in one shared file so that adding a
 * component is adding a folder, and so a change to one never touches the others.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "title", label: "Title", kind: "text", placeholder: "New template added" },
    { prop: "description", label: "Description", kind: "text", placeholder: "The Auralis studio set is live" },
    { prop: "tone", label: "Tone", kind: "select", options: ["primary", "emerald", "amber"], default: "primary", group: "Surface" },
  ],
};
