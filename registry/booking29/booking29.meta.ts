import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "booking29",
  title: "Appointment Intake Match",
  description:
    "Three intake questions that land on a real appointment type instead of a drop-down: the answers pick a route with its length, its facts, and the clinician you will sit with, and the image tile beside them swaps its floated availability card to match.",
  category: "Booking",
  registryDependencies: ["questionnaire"],
  registryComponents: ["badge23", "button21"],
  componentDependencies: ["card31"],
  tags: ["questionnaire"],
};
