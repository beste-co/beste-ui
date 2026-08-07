import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "saas108",
  title: "Branching Scoping Form",
  description:
    "A contact section that asks a branching set of questions instead of one long form: a rail lists the steps that currently apply and lets you jump between them, and answering the first question adds or removes the steps below it.",
  category: "SaaS",
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge6", "button1"],
  tags: ["questionnaire"],
};
