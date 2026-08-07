import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "faq92",
  title: "Answer Router",
  description:
    "A help section that asks two questions instead of offering a search box: the answers pick one written answer from a list of routes, an image tile beside them floats the answer as a live assistant card and changes with it, and a soft panel underneath keeps a way through to a person.",
  category: "FAQ",
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge23", "button21"],
  componentDependencies: ["chat34"],
  tags: ["questionnaire"],
};
