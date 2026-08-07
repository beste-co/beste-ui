import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "travel42",
  title: "Narrowing Destination Shortlist",
  description:
    "A destination finder that eliminates in the open: a grid of six photographs sits beside the questions and dims the places each answer rules out, with a live count under it, before the survivors are listed with their notes and links.",
  category: "Travel",
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge23", "button21"],
  tags: ["questionnaire"],
};
