import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "dock-magnify",
  title: "Dock Magnify",
  description:
    "A dock of app tiles that swells under the pointer the way a desktop dock does: each tile's scale follows a cosine falloff from the pointer, eased every frame and written straight to a CSS variable, so moving along it costs no React renders. Neighbours make room as tiles grow, so nothing clips, and the tiles grow away from the edge the dock sits on (bottom, top, left or right). Labels show beside the hovered tile, a pressed tile hops, and running dots, badges, images, tinted icon tiles and separators are all built in. The dock is one tab stop with arrow keys, and a keyboard-focused tile swells as if hovered; reduced motion keeps every tile at rest.",
  category: "Dock",
  usage: `import { CalendarDays, Mail, Music } from "lucide-react";
import { DockMagnify } from "@/components/beste/component/dock-magnify";

<DockMagnify
  items={[
    { id: "music", label: "Music", icon: Music, tint: "#fb3c5b", running: true },
    { id: "mail", label: "Mail", icon: Mail, tint: "#3b82f6", badge: 12, href: "/mail" },
    { id: "divider", separator: true },
    { id: "calendar", label: "Calendar", icon: CalendarDays, onClick: () => console.log("Open the calendar") },
  ]}
  magnification={2}     // largest scale under the pointer
  distance={160}        // px the swell reaches either side
  side="left"           // "bottom" (default) | "top" | "left" | "right"
  tone="outline"        // "muted" (default) | "outline" | "ghost"
  size="lg"             // "sm" | "default" | "lg"
/>`,
};
