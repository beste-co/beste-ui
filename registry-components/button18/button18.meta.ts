import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button18",
  title: "Corner Brackets Button",
  description:
    "A monospace button framed by corner brackets that spring outward on hover.",
  category: "Button",
  usage: `import { Button18 } from "@/components/beste/component/button18";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button18 asChild label="View manifest">
  <Link href="/about" />
</Button18>

<Button18
  label="Start a project"
  tone="primary"   // "foreground" (default) | "primary" | "muted"
  onClick={() => console.log("start a project")}
/>`,
  usageBase: `import { Button18 } from "@/components/beste/component/button18";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button18 label="View manifest" render={<Link href="/about" />} />

<Button18
  label="Start a project"
  tone="primary"   // "foreground" (default) | "primary" | "muted"
  onClick={() => console.log("start a project")}
/>`,
};
