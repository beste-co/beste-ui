import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "notifications-menu",
  componentName: "NotificationsMenu",
  title: "Notifications Menu",
  description:
    "Topbar bell trigger with an unread count and a popover feed: icon rows with title, description, timestamp, unread dots, a mark-all-read action, and a scrollable list. Manages read state internally.",
  category: "Dashboard",
  registryDependencies: ["popover", "button", "scroll-area", "separator"],
  usage: `import { NotificationsMenu } from "@/components/beste/component/notifications-menu";
import { UserPlus } from "lucide-react";

<NotificationsMenu
  notifications={[
    {
      id: "1",
      title: "New customer signed up",
      description: "Amara joined the Scale plan.",
      time: "2m ago",
      icon: UserPlus,
      unread: true,
    },
  ]}
  onSelect={(id) => console.log("open:", id)}
  onMarkAllRead={() => console.log("all read")}
/>`,
};
