import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "chat2",
  title: "Typing Indicator",
  description:
    "Chat bubble with three staggered dots. Signals that the other side is typing.",
  category: "Chat",
  registryDependencies: ["avatar"],
};
