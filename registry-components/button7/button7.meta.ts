import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button7",
  title: "Play Button",
  description:
    "A video play button with a circular play seal, label, and duration for showreels and product demos.",
  category: "Button",
  usage: `import { Button7 } from "@/components/beste/component/button7";
import Link from "next/link";

<Button7 label="Watch showreel" sublabel="2:31" onClick={() => console.log("play showreel")} />

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button7 asChild label="See it in action" tone="outline">
  <Link href="/demo" />
</Button7>`,
  usageBase: `import { Button7 } from "@/components/beste/component/button7";
import Link from "next/link";

<Button7 label="Watch showreel" sublabel="2:31" onClick={() => console.log("play showreel")} />

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button7
  label="See it in action"
  tone="outline"   // "dark" (default) | "primary" | "outline"
  render={<Link href="/demo" />}
/>`,
};
