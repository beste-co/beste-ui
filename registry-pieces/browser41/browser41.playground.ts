/** Playground for `browser41`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "url", label: "Address", kind: "text", group: "Content" },
    { prop: "brand", label: "Brand", kind: "text", group: "Content" },
    { prop: "greeting", label: "Greeting", kind: "text", group: "Content" },
    { prop: "subtitle", label: "Subtitle", kind: "text", group: "Content" },
    { prop: "period", label: "Period", kind: "text", group: "Content" },
    { prop: "initials", label: "Initials", kind: "text", group: "Content" },
  ],
};
