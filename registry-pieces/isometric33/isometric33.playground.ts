/** Playground for `isometric33`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import { ISOMETRIC_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    ...ISOMETRIC_CONTROLS,
    { prop: "label", label: "Sign", kind: "text", default: "OPEN", group: "Content" },
  ],
};
