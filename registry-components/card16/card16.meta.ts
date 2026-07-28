import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card16",
  title: "Photo Stack Card",
  description:
    "A photo stack card whose tucked prints fan out on hover for albums, galleries, and case studies.",
  category: "Card",
  usage: `import { Card16 } from "@/components/beste/component/card16";

// First image sits on top; up to two more peek from behind.
<Card16
  images={["/albums/offsite-1.jpg", "/albums/offsite-2.jpg", "/albums/offsite-3.jpg"]}
  title="Studio offsite"
  count="24 photos"
  href="/albums/offsite"
/>

<Card16
  images={["/albums/berlin-1.jpg", "/albums/berlin-2.jpg"]}
  title="Berlin sprint"
  tone="primary"   // count chip: "light" (default) | "primary"
/>`,
};
