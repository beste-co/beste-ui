import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "agency24",
  title: "Studio Brief With Changing Plate",
  description:
    "A four-step studio brief where the tall photograph beside it changes with the question on screen, each with its own caption, and sending the brief swaps the plate for the studio and the form for a ledger of the answers.",
  category: "Agency",
  dependencies: ["clsx", "tailwind-merge", "lucide-react", "@radix-ui/react-slot"],
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge7", "button12"],
  tags: ["questionnaire"],
};
