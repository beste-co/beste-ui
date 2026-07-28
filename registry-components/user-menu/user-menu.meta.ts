import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "user-menu",
  componentName: "UserMenu",
  title: "User Menu",
  description:
    "Topbar account menu: avatar trigger with name and email, dropdown with icon items, keyboard shortcuts, and a destructive sign-out row. Compact avatar-only mode for dense headers.",
  category: "Dashboard",
  registryDependencies: ["dropdown-menu", "avatar"],
  usage: `import { UserMenu } from "@/components/beste/component/user-menu";
import { LogOut, Settings } from "lucide-react";

<UserMenu
  user={{ name: "Jordan Ellis", email: "jordan@acme.com" }}
  items={[
    { id: "settings", label: "Settings", icon: Settings, shortcut: "⌘S" },
    { id: "logout", label: "Log out", icon: LogOut, destructive: true },
  ]}
  onSelect={(id) => console.log("selected:", id)}
/>`,
};
