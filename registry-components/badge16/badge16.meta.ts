import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge16",
  title: "Profile Badge",
  description:
    "A profile badge with avatar, name, and role for author and team credits.",
  category: "Badge",
  usage: `import { Badge16 } from "@/components/beste/component/badge16";
import Link from "next/link";

<Badge16 src="/avatars/selin.jpg" name="Selin Aksoy" role="Product Designer" />

// Compose the link with asChild: your Link becomes the chip and the badge
// content is injected as its children.
<Badge16 asChild src="/avatars/mert.jpg" name="Mert Yilmaz" role="@mert" tone="muted">
  <Link href="https://x.com/mert" />
</Badge16>`,
  usageBase: `import { Badge16 } from "@/components/beste/component/badge16";
import Link from "next/link";

<Badge16 src="/avatars/selin.jpg" name="Selin Aksoy" role="Product Designer" />

// Compose the link with the render prop: your Link becomes the chip and the
// badge content stays as its children.
<Badge16
  src="/avatars/mert.jpg"
  name="Mert Yilmaz"
  role="@mert"
  tone="muted"
  render={<Link href="https://x.com/mert" />}
/>`,
};
