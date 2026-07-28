import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "error9",
  title: "404 Did You Mean",
  description:
    "Left-aligned 404 for documentation and marketing sites: the requested path is shown struck through in monospace above a did-you-mean box linking to the closest matching page.",
  category: "Error",
  registryDependencies: ["button"],
};
