import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "ai62",
  title: "Fix and Retry Flow",
  description: "An assistant's call comes back rejected, loops round to fix the request, and lands the second time as saved to draft.",
  category: "AI",
  backdrop: "dawn",
  registryComponents: ["ai-mark"],
  isAnimated: true,
};
