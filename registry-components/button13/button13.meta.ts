import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button13",
  title: "Letter Roll Button",
  description:
    "A pill button whose label rolls up letter by letter with a staggered hover animation.",
  category: "Button",
  usage: `import { Button13 } from "@/components/beste/component/button13";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button13 asChild label="Start your project">
  <Link href="/contact" />
</Button13>

<Button13
  label="Explore services"
  tone="outline"   // "dark" (default) | "primary" | "outline"
  rounded="md"     // "full" (default) | "lg" | "md" | "none"
  hideIcon         // drop the trailing arrow
  onClick={() => console.log("explore services")}
/>`,
  usageBase: `import { Button13 } from "@/components/beste/component/button13";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button13 label="Start your project" render={<Link href="/contact" />} />

<Button13
  label="Explore services"
  tone="outline"   // "dark" (default) | "primary" | "outline"
  rounded="md"     // "full" (default) | "lg" | "md" | "none"
  hideIcon         // drop the trailing arrow
  onClick={() => console.log("explore services")}
/>`,
};
