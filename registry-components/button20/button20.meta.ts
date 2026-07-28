import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button20",
  title: "Magnetic Button",
  description:
    "A magnetic button that is pulled toward the cursor on hover and springs back on leave.",
  category: "Button",
  usage: `import { Button20 } from "@/components/beste/component/button20";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button20 asChild label="Let's talk">
  <Link href="/contact" />
</Button20>

<Button20
  label="See the work"
  icon={ArrowRight}   // optional leading icon
  tone="primary"      // "dark" (default) | "primary"
  strength={0.4}      // cursor pull, 0–1 (default 0.25)
  onClick={() => console.log("see the work")}
/>`,
  usageBase: `import { Button20 } from "@/components/beste/component/button20";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button20 label="Let's talk" render={<Link href="/contact" />} />

<Button20
  label="See the work"
  icon={ArrowRight}   // optional leading icon
  tone="primary"      // "dark" (default) | "primary"
  strength={0.4}      // cursor pull, 0–1 (default 0.25)
  onClick={() => console.log("see the work")}
/>`,
};
