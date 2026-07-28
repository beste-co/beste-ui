import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button5",
  title: "Split Button",
  description:
    "A split button with a main action and a separate secondary trigger for menus and options.",
  category: "Button",
  usage: `import { Button5 } from "@/components/beste/component/button5";
import Link from "next/link";

// Compose the MAIN segment with asChild: your Link becomes the main control
// and the label is injected as its children. The secondary segment is always
// a button (e.g. to open a menu).
<Button5 asChild label="Download" onSecondaryClick={() => console.log("choose platform")}>
  <Link href="/download" />
</Button5>

<Button5
  label="Deploy now"
  onClick={() => console.log("deploy")}
  secondaryLabel="Deployment options"
  onSecondaryClick={() => console.log("open options")}
/>`,
  usageBase: `import { Button5 } from "@/components/beste/component/button5";
import Link from "next/link";

// Compose the MAIN segment with the render prop: your Link becomes the main
// control and the label stays as its children. The secondary segment is
// always a button (e.g. to open a menu).
<Button5
  label="Download"
  render={<Link href="/download" />}
  onSecondaryClick={() => console.log("choose platform")}
/>

<Button5
  label="Deploy now"
  onClick={() => console.log("deploy")}
  secondaryLabel="Deployment options"
  onSecondaryClick={() => console.log("open options")}
/>`,
};
