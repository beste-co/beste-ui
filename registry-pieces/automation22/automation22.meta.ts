import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "automation22",
  title: "Expense Approval Chain",
  description:
    "An expense moves through three approvers in turn. Each one reviews and signs off with a soft check, then a labeled cursor clicks Approve on the last step and it closes on paid out before the chain starts over.",
  category: "Automation",
  isAnimated: true,
  backdrop: "https://oud.pics/b/gradients/gradient-silk-champagne.webp",
};
