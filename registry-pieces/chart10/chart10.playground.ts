/** Playground for `chart10`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", group: "Content" },
    { prop: "surface", label: "Surface", kind: "segmented", options: [{ value: "card", label: "Card" }, { value: "none", label: "None" }], default: "card", group: "Surface" },
    { prop: "bordered", label: "Border", kind: "switch", default: false, group: "Surface" },
  ],
};
