/** Playground for `section-heading`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "heading", label: "Heading", kind: "text", placeholder: "A website, not a codebase" },
    { prop: "layout", label: "Layout", kind: "segmented", options: ["split", "stack"], default: "split" },
  ],
};
