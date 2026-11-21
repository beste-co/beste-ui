import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button26",
  title: "Lift Pill",
  description:
    "A sentence-case pill that lifts a little on hover: the bright secondary fill, the primary fill, a hairline outline in the surface's text color, or a frosted pill for dark grounds. Three heights, and an optional icon that nudges forward after the label or sits before it.",
  category: "Button",
  registryDependencies: ["button"],
  usage: `import { Button26 } from "@/components/beste/component/button26";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button26 asChild label="Start free" icon={ArrowRight} size="lg">
  <Link href="/signup" />
</Button26>

<Button26
  label="See how it works"
  tone="glass"          // "secondary" (default) | "primary" | "outline" | "glass"
  size="lg"             // "sm" | "default" | "lg"
  icon={Play}
  iconPosition="start"  // "end" (default) | "start"
  onClick={() => console.log("clicked")}
/>`,
  usageBase: `import { Button26 } from "@/components/beste/component/button26";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button26 label="Start free" icon={ArrowRight} size="lg" render={<Link href="/signup" />} nativeButton={false} />

<Button26
  label="See how it works"
  tone="glass"          // "secondary" (default) | "primary" | "outline" | "glass"
  size="lg"             // "sm" | "default" | "lg"
  icon={Play}
  iconPosition="start"  // "end" (default) | "start"
  onClick={() => console.log("clicked")}
/>`,
};
