/** Playground for `stage-panel`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "surface", label: "Surface", kind: "select", options: ["muted", "sky", "image", "none"], default: "muted" },
    {
      prop: "sky",
      label: "Sky",
      kind: "select",
      options: ["dawn", "haze", "azure", "dusk", "mist", "apricot", "lilac", "sage", "stone", "night"],
      default: "dawn",
      when: { prop: "surface", equals: "sky" },
    },
  ],
};
