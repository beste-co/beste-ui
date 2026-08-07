import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "podcast54",
  title: "Listening Path Builder",
  description:
    "An entry point for a back catalogue: three questions score the listening paths, and the winner is handed over as an ordered run of three episodes with cover art, numbers, and a total runtime added up from the episodes themselves.",
  category: "Podcast",
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge6", "button1"],
  tags: ["questionnaire"],
};
