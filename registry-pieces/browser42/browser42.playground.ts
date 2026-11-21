/** Playground for `browser42`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "projectName", label: "Project", kind: "text", group: "Content" },
    { prop: "page", label: "Page", kind: "text", group: "Content" },
    { prop: "url", label: "Address", kind: "text", group: "Content" },
    { prop: "publishLabel", label: "Publish", kind: "text", group: "Content" },
    { prop: "fill", label: "Fill", kind: "switch", default: false, group: "Surface" },
  ],
};
