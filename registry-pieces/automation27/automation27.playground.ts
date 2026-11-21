/** Playground for `automation27`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "surface", label: "Surface", kind: "segmented", options: [{ value: "muted", label: "Muted" }, { value: "card", label: "Card" }, { value: "none", label: "None" }], default: "muted", group: "Surface" },
  ],
};
