import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button2",
  title: "Underline Arrow Button",
  description:
    "A minimal text button with an animated underline and arrow for lightweight calls to action.",
  category: "Button",
  usage: `import { Button2 } from "@/components/beste/component/button2";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button2 asChild label="View all case studies">
  <Link href="/work" />
</Button2>

<Button2
  label="See pricing"
  tone="muted"   // "foreground" (default) | "muted" | "primary"
  hideIcon       // drop the trailing arrow
  onClick={() => console.log("see pricing")}
/>`,
  usageBase: `import { Button2 } from "@/components/beste/component/button2";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button2 label="View all case studies" render={<Link href="/work" />} />

<Button2
  label="See pricing"
  tone="muted"   // "foreground" (default) | "muted" | "primary"
  hideIcon       // drop the trailing arrow
  onClick={() => console.log("see pricing")}
/>`,
};
