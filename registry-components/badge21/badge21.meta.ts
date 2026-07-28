import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge21",
  title: "Announcement Badge",
  description:
    "An announcement pill badge with a bold tag, message, and optional link arrow for hero sections.",
  category: "Badge",
  usage: `import { Badge21 } from "@/components/beste/component/badge21";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the pill (and it shows
// the trailing arrow); the badge content is injected as its children.
<Badge21 asChild tag="New" text="The Auralis studio set is live">
  <Link href="/changelog" />
</Badge21>

<Badge21
  tag="v2.0"
  text="Now with 1,400+ blocks"
  tone="foreground"   // tag chip: "primary" (default) | "foreground"
/>`,
  usageBase: `import { Badge21 } from "@/components/beste/component/badge21";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the pill (and it
// shows the trailing arrow); the badge content stays as its children.
<Badge21 tag="New" text="The Auralis studio set is live" render={<Link href="/changelog" />} />

<Badge21
  tag="v2.0"
  text="Now with 1,400+ blocks"
  tone="foreground"   // tag chip: "primary" (default) | "foreground"
/>`,
};
