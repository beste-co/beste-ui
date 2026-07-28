import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button15",
  title: "Expanding Reveal Button",
  description:
    "An expanding icon button that reveals its label on hover or focus for compact layouts.",
  category: "Button",
  usage: `import { Button15 } from "@/components/beste/component/button15";
import Link from "next/link";
import { Mail } from "lucide-react";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children. Collapsed it shows
// only the icon; hover/focus reveals the label.
<Button15 asChild label="Get in touch">
  <Link href="/contact" />
</Button15>

<Button15
  label="Email us"
  icon={Mail}      // seal icon (default: ArrowRight)
  tone="outline"   // "dark" (default) | "primary" | "outline"
  rounded="lg"     // "full" (default) | "lg" | "md" | "none", mirrored onto the seal
  onClick={() => console.log("email us")}
/>`,
  usageBase: `import { Button15 } from "@/components/beste/component/button15";
import Link from "next/link";
import { Mail } from "lucide-react";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button15 label="Get in touch" render={<Link href="/contact" />} />

<Button15
  label="Email us"
  icon={Mail}      // seal icon (default: ArrowRight)
  tone="outline"   // "dark" (default) | "primary" | "outline"
  rounded="lg"     // "full" (default) | "lg" | "md" | "none", mirrored onto the seal
  onClick={() => console.log("email us")}
/>`,
};
