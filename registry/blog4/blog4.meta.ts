import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "blog4",
  title: "Featured Hero with Grid",
  description:
    "Large featured article with side-by-side image and content, followed by a three-column grid of secondary posts. Read more buttons and author details included.",
  category: "Blog",
  registryDependencies: ["badge", "avatar", "button"],
};
