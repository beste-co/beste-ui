import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button27",
  title: "Quiet Pill",
  description:
    "A plain sentence-case pill with no motion of its own: the ink fill, a hairline outline on the card color, a frosted pill for photos, the reversed pill for ink panels, a hairline in the current text color, or a fixed dark pill for light pictures in any theme. Two heights.",
  category: "Button",
  registryDependencies: ["button"],
  usage: `import { Button27 } from "@/components/beste/component/button27";
import Link from "next/link";

<Button27 asChild label="Start free">
  <Link href="/signup" />
</Button27>

<Button27
  label="Login"
  tone="outline"   // "primary" (default) | "outline" | "soft" | "inverse" | "ghost" | "ink"
  size="sm"        // "sm" | "default"
  onClick={() => console.log("clicked")}
/>`,
  usageBase: `import { Button27 } from "@/components/beste/component/button27";
import Link from "next/link";

<Button27 label="Start free" render={<Link href="/signup" />} nativeButton={false} />

<Button27
  label="Login"
  tone="outline"   // "primary" (default) | "outline" | "soft" | "inverse" | "ghost" | "ink"
  size="sm"        // "sm" | "default"
  onClick={() => console.log("clicked")}
/>`,
};
