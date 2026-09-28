import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button24",
  title: "Turn Arrow Button",
  description:
    "A square-cornered block button with a down-right arrow that swings a quarter turn to point right on hover while the fill switches to the accent. Built for poster layouts and hard grids.",
  category: "Button",
  registryDependencies: ["button"],
  usage: `import { Button24 } from "@/components/beste/component/button24";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button24 asChild label="Get a festival pass">
  <Link href="/passes" />
</Button24>

<Button24
  label="See the program"
  tone="primary"   // "dark" (default) | "primary" | "light"
  onClick={() => console.log("clicked")}
/>`,
  usageBase: `import { Button24 } from "@/components/beste/component/button24";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button24 label="Get a festival pass" render={<Link href="/passes" />} nativeButton={false} />

<Button24
  label="See the program"
  tone="primary"   // "dark" (default) | "primary" | "light"
  onClick={() => console.log("clicked")}
/>`,
};
