import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "ecommerce46",
  title: "Product Finder Quiz",
  description:
    "A finder that replaces a filter sidebar: three questions score every product against the traits the answers ask for, and the winner takes over the plate beside them with its photograph, its price, and the reasons it came out on top.",
  category: "Ecommerce",
  dependencies: ["clsx", "tailwind-merge", "lucide-react", "@radix-ui/react-slot"],
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge7", "button12"],
  tags: ["questionnaire"],
};
