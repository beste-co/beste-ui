import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button19",
  title: "Scramble Button",
  description:
    "A scramble text button that cycles random glyphs on hover for developer and tech landings.",
  category: "Button",
  usage: `import { Button19 } from "@/components/beste/component/button19";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button19 asChild label="Decrypt access">
  <Link href="/signup" />
</Button19>

<Button19
  label="Run diagnostics"
  tone="dark"   // "outline" (default) | "dark" | "primary"
  onClick={() => console.log("run diagnostics")}
/>`,
  usageBase: `import { Button19 } from "@/components/beste/component/button19";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button19 label="Decrypt access" render={<Link href="/signup" />} />

<Button19
  label="Run diagnostics"
  tone="dark"   // "outline" (default) | "dark" | "primary"
  onClick={() => console.log("run diagnostics")}
/>`,
};
