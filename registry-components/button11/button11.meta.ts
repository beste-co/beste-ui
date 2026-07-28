import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button11",
  title: "Pressable Button",
  description:
    "A neobrutalist button with a hard offset shadow that lifts on hover and presses in on click.",
  category: "Button",
  usage: `import { Button11 } from "@/components/beste/component/button11";
import { Zap } from "lucide-react";
import Link from "next/link";

<Button11 label="Press me" onClick={() => console.log("pressed")} />

// Compose the link with asChild: your Link becomes the rendered element
// and the button content is injected as its children.
<Button11 asChild label="Get started" icon={Zap} tone="primary">
  <Link href="/signup" />
</Button11>`,
  usageBase: `import { Button11 } from "@/components/beste/component/button11";
import { Zap } from "lucide-react";
import Link from "next/link";

<Button11 label="Press me" onClick={() => console.log("pressed")} />

// Compose the link with the render prop: your Link becomes the rendered
// element and the button content stays as its children.
<Button11
  label="Get started"
  icon={Zap}
  tone="primary"
  render={<Link href="/signup" />}
/>`,
};
