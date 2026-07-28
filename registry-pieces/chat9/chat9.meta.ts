import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "chat9",
  title: "Conversation Item",
  description:
    "Inbox row with avatar, name, message preview, timestamp, and a primary unread count chip.",
  category: "Chat",
  registryDependencies: ["avatar"],
};
