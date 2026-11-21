/** Playground for `editor62`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "heading", label: "Heading", kind: "text", default: "Skin care that takes its time" },
    { prop: "surface", label: "Surface", kind: "segmented", options: [{ value: "muted", label: "Muted" }, { value: "none", label: "None" }], default: "muted", group: "Surface" },
    { prop: "framed", label: "Framed", kind: "switch", default: true, group: "Surface" },
  ],
};
