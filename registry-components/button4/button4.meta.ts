import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button4",
  title: "Icon Button",
  description:
    "An accessible icon button with a required label, three sizes, and circle or square shape.",
  category: "Button",
  usage: `import { Button4 } from "@/components/beste/component/button4";
import { Play } from "lucide-react";
import Link from "next/link";

// Icon-only: label is required and becomes the accessible name.
<Button4 label="Play showreel" icon={Play} onClick={() => console.log("play showreel")} />

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button4 asChild label="Open on GitHub" tone="dark" size="lg" rounded="md">
  <Link href="https://github.com/beste" />
</Button4>`,
  usageBase: `import { Button4 } from "@/components/beste/component/button4";
import { Play } from "lucide-react";
import Link from "next/link";

// Icon-only: label is required and becomes the accessible name.
<Button4 label="Play showreel" icon={Play} onClick={() => console.log("play showreel")} />

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button4
  label="Open on GitHub"
  tone="dark"    // "neutral" (default) | "dark" | "primary"
  size="lg"      // "sm" | "md" (default) | "lg"
  rounded="md"   // "full" (default) | "md"
  render={<Link href="https://github.com/beste" />}
/>`,
};
