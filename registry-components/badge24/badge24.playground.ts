/**
 * Playground for `badge24`: its text and the element it renders as.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "text", label: "Text", kind: "text", placeholder: "Alder Row, Riverside" },
    { prop: "as", label: "Element", kind: "segmented", options: ["p", "span", "div"], default: "p" },
    { prop: "trigger", label: "Trigger", kind: "segmented", options: ["view", "mount", "none"], default: "view" },
  ],
};
