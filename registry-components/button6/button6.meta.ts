import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button6",
  title: "Avatar Stack Button",
  description:
    "A social proof button with an avatar stack inside the pill and a trailing arrow.",
  category: "Button",
  usage: `import { Button6 } from "@/components/beste/component/button6";
import Link from "next/link";

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button6
  asChild
  label="Join 2,400+ members"
  avatars={["/avatars/mia.jpg", "/avatars/deniz.jpg", "/avatars/omar.jpg"]}
>
  <Link href="/signup" />
</Button6>

<Button6
  label="Meet the community"
  avatars={["/avatars/ada.jpg", "/avatars/can.jpg"]}
  tone="outline"   // "dark" (default) | "primary" | "outline"
  onClick={() => console.log("meet the community")}
/>`,
  usageBase: `import { Button6 } from "@/components/beste/component/button6";
import Link from "next/link";

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button6
  label="Join 2,400+ members"
  avatars={["/avatars/mia.jpg", "/avatars/deniz.jpg", "/avatars/omar.jpg"]}
  render={<Link href="/signup" />}
/>

<Button6
  label="Meet the community"
  avatars={["/avatars/ada.jpg", "/avatars/can.jpg"]}
  tone="outline"   // "dark" (default) | "primary" | "outline"
  onClick={() => console.log("meet the community")}
/>`,
};
