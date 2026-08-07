import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "product12",
  title: "Live Made To Order Configurator",
  description:
    "A made-to-order configurator that answers as you go: every option takes over the plate beside it, writes its own line into a running specification, and moves a total that is visible from the first question rather than revealed at the end.",
  category: "Product",
  dependencies: ["clsx", "tailwind-merge", "lucide-react", "@radix-ui/react-slot"],
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge7", "button12"],
  tags: ["questionnaire"],
};
