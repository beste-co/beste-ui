/** Playground for `ai-mark`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "brand", label: "Brand", kind: "select", options: ["beste", "claude", "openai", "cursor", "grok", "gemini", "wordpress"], default: "beste" },
    { prop: "colored", label: "Colored", kind: "switch" },
  ],
};
