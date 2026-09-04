import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button22",
  title: "Sliding Marker Pill",
  description:
    "An uppercase, letter-spaced pill with a small marker at its end. On hover the marker slips out on the right while the label slides over and a twin marker arrives from the left, in one smooth motion.",
  category: "Button",
  registryDependencies: ["button"],
  usage: `import { Button22 } from "@/components/beste/component/button22";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button22 asChild label="Start your journey">
  <Link href="/contact" />
</Button22>

<Button22
  label="See how it works"
  icon={ArrowRight}   // replaces the dot marker
  tone="outline"      // "primary" (default) | "light" | "dark" | "outline"
  onClick={() => console.log("clicked")}
/>`,
  usageBase: `import { Button22 } from "@/components/beste/component/button22";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button22 label="Start your journey" render={<Link href="/contact" />} nativeButton={false} />

<Button22
  label="See how it works"
  icon={ArrowRight}   // replaces the dot marker
  tone="outline"      // "primary" (default) | "light" | "dark" | "outline"
  onClick={() => console.log("clicked")}
/>`,
};
