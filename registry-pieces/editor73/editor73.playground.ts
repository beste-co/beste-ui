/** Playground for `editor73`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    {
      prop: "selected",
      label: "Image motion",
      kind: "segmented",
      options: ["Scale", "Parallax", "Fade", "Blur"],
      default: "Parallax",
      group: "Content",
    },
    { prop: "entrance", label: "Entrance", kind: "text", group: "Content" },
    { prop: "framed", label: "Framed", kind: "switch", default: true, group: "Surface" },
    { prop: "fill", label: "Fill", kind: "switch", default: false, group: "Surface" },
  ],
};
