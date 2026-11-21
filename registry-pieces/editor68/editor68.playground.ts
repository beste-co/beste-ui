/** Playground for `editor68`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "label", label: "Label", kind: "text", default: "Skin workshop" },
    { prop: "before", label: "Before", kind: "text", default: "12 May" },
    { prop: "after", label: "After", kind: "text", default: "9 June" },
    { prop: "animate", label: "Motion", kind: "switch", default: true, group: "Motion" },
    { prop: "framed", label: "Framed", kind: "switch", default: true, group: "Surface" },
  ],
};
