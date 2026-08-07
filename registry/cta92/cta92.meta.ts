import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "cta92",
  title: "Tailored Subscription",
  description:
    "A newsletter CTA that asks before it asks for an address: subjects, then cadence, then the email, and the column swaps itself for a confirmation that reads back exactly what was chosen.",
  category: "CTA",
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge6", "button1"],
  tags: ["questionnaire"],
};
