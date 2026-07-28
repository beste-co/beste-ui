# Health6: Wellness Editorial Section

Long-form editorial layout: a centered eyebrow and heading, a large lead paragraph, a hairline divider, then a free-form rich-text body, a bullet list of highlights, and a centered CTA row. Suited to wellness blogs and healing-journey style pages.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/health6"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/health6"
```

This installs the block to `components/beste/block/health6.tsx` and the shadcn/ui `button` primitive it depends on.

## Quick start

The installed file exports `health6Demo` alongside the block: the exact props behind the preview above. Spread it to get a working editorial section in one line.

```tsx
import { Health6, health6Demo } from "@/components/beste/block/health6";

export default function StoryPage() {
  return <Health6 {...health6Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Health6 } from "@/components/beste/block/health6";

export default function StoryPage() {
  return (
    <Health6
      eyebrow="Our Story"
      heading="Healing is not a straight line"
      lead="We built this practice for people who tried everything else first."
      content="<p>Our founders spent <strong>a decade</strong> in clinical burnout research before opening the first studio. <em>Meet yourself where you are</em> is still the first thing every client hears.</p>"
      highlights={[
        "One-on-one intake with a certified practitioner",
        "Programs adjusted every four weeks",
        "Community check-ins, not just solo homework",
      ]}
      buttons={[{ label: "Book an intake call", href: "/book" }]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `eyebrow` | `string` | – | Small uppercase label above the heading |
| `heading` | `string` | – | Section heading, rendered as an `<h1>` |
| `lead` | `string` | – | Large intro paragraph under the heading |
| `content` | `string` | – | Rich HTML body content (see Behavior notes) |
| `highlights` | `string[]` | `[]` | Bullet list rendered after the body content |
| `buttons` | `ButtonItem[]` | `[]` | Centered CTA row at the bottom |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
};
```

## Behavior notes

- `content` is injected with `dangerouslySetInnerHTML`, so it accepts raw HTML rather than plain text; the type's own doc comment calls out `<p>`, `<strong>`, `<em>`, and `<a>` as supported tags. Callers are responsible for sanitizing any content that isn't fully trusted before passing it in.
- The content wrapper uses `prose prose-lg prose-neutral dark:prose-invert`, which requires the `@tailwindcss/typography` plugin (listed in the block's `dependencies`) to actually apply its styling.
- Layout is a single narrow `max-w-2xl` column: centered eyebrow/heading, a centered lead paragraph, a centered hairline divider, then the free-form `content`, the `highlights` list, and centered CTA buttons, in that fixed order.
- `highlights` render as a plain dot-bullet list (a small rounded `span`), not an icon-based checklist.
