/** Playground for `editor71`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    {
      prop: "selected",
      label: "Selected",
      kind: "select",
      options: ["Split hero", "Centered hero", "Full-width photo", "Hero with stats"],
      default: "Split hero",
      group: "Content",
    },
    { prop: "searchPlaceholder", label: "Search", kind: "text", group: "Content" },
    { prop: "framed", label: "Framed", kind: "switch", default: true, group: "Surface" },
    { prop: "fill", label: "Fill", kind: "switch", default: false, group: "Surface" },
  ],
};
