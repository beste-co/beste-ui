import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "error2",
  title: "404 With Site Search",
  description:
    "Search-first 404 page: a controlled search field with a submit handler, plus a bordered list of suggested pages with titles, descriptions, and hover arrows.",
  category: "Error",
  registryDependencies: ["button", "input"],
};
