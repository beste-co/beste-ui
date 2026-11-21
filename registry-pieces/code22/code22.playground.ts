/** Playground for `code22`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "domain", label: "Domain", kind: "text", group: "Content" },
    { prop: "framed", label: "Framed", kind: "switch", default: true, group: "Surface" },
    { prop: "fill", label: "Fill", kind: "switch", default: false, group: "Surface" },
  ],
};
