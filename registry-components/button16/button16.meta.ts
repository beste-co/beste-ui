import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button16",
  title: "Shine Sweep Button",
  description:
    "A premium pill button with a diagonal shine sweep on hover for pricing and upgrade actions.",
  category: "Button",
  usage: `import { Button16 } from "@/components/beste/component/button16";
import Link from "next/link";
import { Sparkles } from "lucide-react";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button16 asChild label="Upgrade to Pro">
  <Link href="/pricing" />
</Button16>

<Button16
  label="Go Premium"
  icon={Sparkles}   // optional leading icon
  tone="primary"    // "dark" (default) | "primary"
  rounded="md"      // "full" (default) | "lg" | "md" | "none"
  onClick={() => console.log("start checkout")}
/>`,
  usageBase: `import { Button16 } from "@/components/beste/component/button16";
import Link from "next/link";
import { Sparkles } from "lucide-react";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button16 label="Upgrade to Pro" render={<Link href="/pricing" />} />

<Button16
  label="Go Premium"
  icon={Sparkles}   // optional leading icon
  tone="primary"    // "dark" (default) | "primary"
  rounded="md"      // "full" (default) | "lg" | "md" | "none"
  onClick={() => console.log("start checkout")}
/>`,
};
