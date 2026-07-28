# Footer23: Social Media Showcase Footer

Centered footer built around a "follow us" callout: logo, then a heading and description, then a row of large circular social icon buttons, then a secondary nav row and copyright. Aimed at creators and influencer brands driving social follows rather than site navigation.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/footer23"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/footer23"
```

This installs the block to `components/beste/block/footer23.tsx` and its dependencies.

## Quick start

The installed file exports `footer23Demo` alongside the block: the exact props behind the preview above. Spread it to get a working footer in one line.

```tsx
import { Footer23, footer23Demo } from "@/components/beste/block/footer23";

export default function Layout() {
  return <Footer23 {...footer23Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Footer23 } from "@/components/beste/block/footer23";

export default function Layout() {
  return (
    <Footer23
      logo={{ text: "Studio Nine", href: "/" }}
      heading="Come say hi on social"
      description="New drops and behind-the-scenes posts every week."
      socialLinks={[
        { icon: "instagram", href: "https://instagram.com/studionine", label: "Instagram" },
        { icon: "youtube", href: "https://youtube.com/studionine", label: "YouTube" },
        { icon: "twitter", href: "https://twitter.com/studionine", label: "Twitter" },
      ]}
      links={[
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]}
      copyright="© 2026 Studio Nine."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `logo` | `Logo` | – | Wordmark link; hidden entirely when `logo.text` is unset |
| `heading` | `string` | – | Callout heading above the social row |
| `description` | `string` | – | Supporting line under the heading |
| `socialLinks` | `SocialLink[]` | `[]` | Large circular social icon buttons |
| `links` | `NavLink[]` | `[]` | Secondary nav row, shown below the social icons |
| `copyright` | `string` | – | Copyright line, shown last |
| `className` | `string` | – | Extra classes for the outer `<footer>` |

```ts
type Logo = { text?: string; href?: string };
type SocialLink = {
  icon: "twitter" | "github" | "linkedin" | "facebook" | "instagram" | "youtube";
  href?: string;
  label?: string;
};
type NavLink = { label: string; href?: string };
```

## Behavior notes

- Supports six social icons (`twitter`, `github`, `linkedin`, `facebook`, `instagram`, `youtube`) via the `socialIcons` map, the widest icon set of any footer in this group.
- `socialLinks` render as large `size-12` circular buttons (`rounded-full border bg-card`) with a hover fill (`hover:bg-muted`), a heavier visual treatment than footer11's plain icon links.
- The secondary `links` nav renders below the social row with extra top spacing (`mt-12`), visually demoted underneath the social callout rather than treated as primary navigation.
- `social.label` is used only as the link's `aria-label`; it is not rendered as visible text next to the icon.
