import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "sidebar-nav",
  componentName: "SidebarNav",
  title: "Sidebar Nav",
  description:
    "Dashboard sidebar with a brand header, grouped nav items, Lucide icons, trailing count badges, and an active state. Collapse is driven from the shell topbar via the `collapsed` prop (icon rail when true).",
  category: "Dashboard",
  registryDependencies: [],
  usage: `import { SidebarNav } from "@/components/beste/component/sidebar-nav";
import { LayoutDashboard, Users } from "lucide-react";

// The collapse toggle lives in your topbar; pass \`collapsed\` down.
<SidebarNav
  brand={{ name: "Acme Inc" }}
  collapsed={collapsed}
  defaultActiveId="dashboard"
  groups={[
    {
      label: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "customers", label: "Customers", icon: Users, badge: 24 },
      ],
    },
  ]}
  onNavigate={(id) => console.log("navigate:", id)}
/>`,
};
