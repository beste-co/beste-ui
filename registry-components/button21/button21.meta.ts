import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button21",
  title: "Soft Action Button",
  description:
    "A compact, softly rounded action button with a solid accent, soft neutral, or hairline outline tone and an optional trailing icon.",
  category: "Button",
  registryDependencies: ["button"],
  usage: `import { Button21 } from "@/components/beste/component/button21";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button21 asChild label="Book a demo">
  <Link href="/demo" />
</Button21>

<Button21
  label="Start free"
  icon={ArrowRight}   // optional trailing icon
  tone="outline"      // "primary" (default) | "neutral" | "outline"
  onClick={() => console.log("clicked")}
/>`,
  usageBase: `import { Button21 } from "@/components/beste/component/button21";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button21 label="Book a demo" render={<Link href="/demo" />} nativeButton={false} />

<Button21
  label="Start free"
  icon={ArrowRight}   // optional trailing icon
  tone="outline"      // "primary" (default) | "neutral" | "outline"
  onClick={() => console.log("clicked")}
/>`,
};
