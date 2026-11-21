import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "section-heading",
  title: "Section Heading",
  description:
    "The heading row a section opens with: a large medium-weight heading with the copy beside it on wide screens, or under it. Underlined links or a row of pills can follow the copy, or stand alone where there is none.",
  category: "Text",
  registryComponents: ["button27"],
  dependencies: [],
  usage: `import { SectionHeading } from "@/components/beste/component/section-heading";

<SectionHeading
  heading="Guides from the blog"
  link={{ label: "All guides", href: "/blog" }}
  layout="split"   // "split" (default) | "stack"
/>`,
};
