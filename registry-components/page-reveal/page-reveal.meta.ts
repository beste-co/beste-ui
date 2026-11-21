import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "page-reveal",
  title: "Page Reveal",
  description:
    "A page wrapper that blurs every marked section into focus as it scrolls in, its headings, paragraphs and cards one after another. Nothing inside the blocks is marked: it walks each section down to the pieces a reader sees as one thing, and respects reduced motion.",
  category: "Motion",
  componentName: "PageReveal",
  hidden: true,
  dependencies: [],
  usage: `import { PageReveal } from "@/components/beste/component/page-reveal";

<PageReveal className="w-full bg-background">
  <div data-reveal-nav="">{/* fades in on load */}</div>
  <div data-reveal="">{/* a section */}</div>
  <div data-reveal="">{/* another section */}</div>
</PageReveal>`,
};
