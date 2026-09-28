import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button23",
  title: "Arrow Pill",
  description:
    "A calm sentence-case pill with an arrow. On hover the arrow slips out the way it points while a twin arrives from behind it, either up and to the right or straight to the right. A white tone holds on dark or photographic surfaces in both themes, and a hairline outline takes the surface's text color.",
  category: "Button",
  registryDependencies: ["button"],
  usage: `import { Button23 } from "@/components/beste/component/button23";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button23 asChild label="Enter the studio">
  <Link href="/studio" />
</Button23>

<Button23
  label="Watch the reel"
  tone="outline"   // "light" (default) | "outline" | "dark" | "primary"
  size="sm"        // "default" | "sm"
  direction="right" // "up-right" (default) | "right"
  onClick={() => console.log("clicked")}
/>`,
  usageBase: `import { Button23 } from "@/components/beste/component/button23";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button23 label="Enter the studio" render={<Link href="/studio" />} nativeButton={false} />

<Button23
  label="Watch the reel"
  tone="outline"   // "light" (default) | "outline" | "dark" | "primary"
  size="sm"        // "default" | "sm"
  onClick={() => console.log("clicked")}
/>`,
};
