import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "chat1",
  title: "Message Bubble",
  description:
    "Chat bubble with an avatar and timestamp. Role flips alignment and color.",
  category: "Chat",
  registryDependencies: ["avatar"],
};
