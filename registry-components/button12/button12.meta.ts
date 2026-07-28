import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button12",
  title: "Editorial CTA Button",
  description:
    "An editorial pill button with a rolling label and animated icon seal on hover.",
  category: "Button",
  usage: `import { Button12 } from "@/components/beste/component/button12";
import { Phone } from "lucide-react";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button12 asChild label="Book an intro call">
  <Link href="/contact" />
</Button12>

<Button12
  label="See our work"
  icon={Phone}     // seal icon (default: ArrowUpRight)
  tone="outline"   // "dark" (default) | "primary" | "outline"
  onClick={() => console.log("open modal")}
/>`,
  usageBase: `import { Button12 } from "@/components/beste/component/button12";
import { Phone } from "lucide-react";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button12 label="Book an intro call" render={<Link href="/contact" />} />

<Button12
  label="See our work"
  icon={Phone}     // seal icon (default: ArrowUpRight)
  tone="outline"   // "dark" (default) | "primary" | "outline"
  onClick={() => console.log("open modal")}
/>`,
};
