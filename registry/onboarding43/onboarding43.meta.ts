import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "onboarding43",
  title: "Guided Workspace Setup",
  description:
    "A two-column setup section: the pitch and what each answer changes on the left, and a one-question-at-a-time wizard on the right that ends in a review of everything it is about to create.",
  category: "Onboarding",
  dependencies: ["clsx", "tailwind-merge", "lucide-react", "@radix-ui/react-slot"],
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge7", "button12"],
  tags: ["questionnaire"],
};
