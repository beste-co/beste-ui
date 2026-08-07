import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "education102",
  title: "Lesson Check Quiz",
  description:
    "An end-of-lesson knowledge check: a two-column header, a three-figure strip for questions, pass mark, and attempts, a graded quiz that swaps itself for a score and a per-question review, and a list of readings for whatever went wrong.",
  category: "Education",
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge23", "button21"],
  tags: ["questionnaire"],
};
