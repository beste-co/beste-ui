import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "blog3",
  title: "Card Grid with Authors",
  description:
    "Three-column responsive grid of blog cards featuring author avatars, tag badges, and hover zoom effects. Clean card design with date and read time metadata.",
  category: "Blog",
  registryDependencies: ["badge", "avatar"],
};
