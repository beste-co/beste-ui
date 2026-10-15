import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button25",
  title: "Quiet Pill",
  description:
    "A plain sentence-case pill with no tricks: a dark fill for light pages, a hairline outline that takes the surface's text color, the accent, or a paper pill for photographs. An optional icon sits after the label and nudges right on hover.",
  category: "Button",
  registryDependencies: ["button"],
  usage: `import { Button25 } from "@/components/beste/component/button25";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button25 asChild label="Register your interest" icon={ArrowRight}>
  <Link href="/register" />
</Button25>

<Button25
  label="View the residences"
  tone="outline"   // "dark" (default) | "outline" | "primary" | "neutral"
  size="sm"        // "default" | "sm"
  onClick={() => console.log("clicked")}
/>

// Inside a form
<Button25 label="Send" type="submit" />`,
  usageBase: `import { Button25 } from "@/components/beste/component/button25";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button25 label="Register your interest" icon={ArrowRight} render={<Link href="/register" />} nativeButton={false} />

<Button25
  label="View the residences"
  tone="outline"   // "dark" (default) | "outline" | "primary" | "neutral"
  size="sm"        // "default" | "sm"
  onClick={() => console.log("clicked")}
/>`,
};
