import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "event101",
  title: "Slot By Slot Day Builder",
  description:
    "A programme picker that builds the day beside the questions: one choice per time slot drops a session card with its room, its length, and its photograph into a running plan, and the hours left open stay on the page instead of being hidden.",
  category: "Event",
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge23", "button21"],
  tags: ["questionnaire"],
};
