import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "scroll-toc",
  title: "Scroll TOC",
  description:
    "A table of contents that follows the reader: the current section is the last heading past a line near the top (the last one once the page bottoms out, the topmost in view before any has passed), and a marker slides and resizes onto it along a thin rail. Entries come from an items list, from headings collected out of a container, or from the content passed as children, which lays the list and its own scroll area side by side. Clicks scroll smoothly, respect scroll-margin, move focus to the heading and hold the marker steady while the page travels; deeper levels indent and can collapse to the current section. Works on the page or inside any scroll container.",
  category: "Scroll",
  cardScale: 0.6,
  usage: `import { ScrollToc } from "@/components/beste/component/scroll-toc";

// Beside an article on the page: headings are collected from it
<aside className="sticky top-24">
  <ScrollToc containerSelector="article" offset={96} />
</aside>

// Explicit entries, inside a scroll container
<ScrollToc
  root="#docs-scroller"
  items={[
    { id: "install", title: "Install", level: 2 },
    { id: "props", title: "Props", level: 2 },
    { id: "events", title: "Events", level: 3 },
  ]}
  collapse          // deeper levels only under the current section
  updateHash
/>

// Content and contents together, in one scroll area
<ScrollToc className="h-[32rem]">
  <article>...</article>
</ScrollToc>`,
};
