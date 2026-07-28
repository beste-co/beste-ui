import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button1",
  title: "Seal Arrow Button",
  description:
    "An uppercase pill button with a trailing seal arrow chip and an optional link.",
  category: "Button",
  registryDependencies: ["button"],
  usage: `import { Button1 } from "@/components/beste/component/button1";
import { Download } from "lucide-react";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the pill content (label + seal) is injected as its children.
<Button1 asChild label="Read more">
  <Link href="/pricing" />
</Button1>

<Button1
  label="Download"
  icon={Download}   // trailing seal icon (default: ArrowRight)
  tone="primary"    // "dark" (default) | "primary"
  roundedFull       // fully round the pill and the seal
  onClick={() => console.log("start download")}
/>`,
  usageBase: `import { Button1 } from "@/components/beste/component/button1";
import { Download } from "lucide-react";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the pill content (label + seal) stays as its children.
<Button1 label="Read more" render={<Link href="/pricing" />} nativeButton={false} />

<Button1
  label="Download"
  icon={Download}   // trailing seal icon (default: ArrowRight)
  tone="primary"    // "dark" (default) | "primary"
  roundedFull       // fully round the pill and the seal
  onClick={() => console.log("start download")}
/>`,
};
