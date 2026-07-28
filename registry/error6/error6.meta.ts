import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "error6",
  title: "Inline 404 Line",
  description:
    "The smallest possible 404: the status code and the message sit on one line separated by a vertical rule, stacking on mobile, with a single outline button underneath.",
  category: "Error",
  registryDependencies: ["button"],
};
