# Footer11: Centered Social Footer

Fully centered, vertically stacked footer: logo, then navigation links, then social icon links, then copyright, one below the other. Suited to portfolios and personal sites that want a symmetrical footer without column layouts.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/footer11"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/footer11"
```

This installs the block to `components/beste/block/footer11.tsx` and its dependencies.

## Quick start

The installed file exports `footer11Demo` alongside the block: the exact props behind the preview above. Spread it to get a working footer in one line.

```tsx
import { Footer11, footer11Demo } from "@/components/beste/block/footer11";

export default function Layout() {
  return <Footer11 {...footer11Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Footer11 } from "@/components/beste/block/footer11";

export default function Layout() {
  return (
    <Footer11
      logo={{ text: "Jordan Lane", href: "/" }}
      navLinks={[
        { label: "Work", href: "/work" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]}
      socialLinks={[
        { icon: "twitter", href: "https://twitter.com/jordanlane", label: "Twitter" },
        { icon: "github", href: "https://github.com/jordanlane", label: "GitHub" },
      ]}
      copyright="© 2026 Jordan Lane."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `logo` | `Logo` | – | Wordmark link; hidden entirely when `logo.text` is unset |
| `navLinks` | `NavLink[]` | `[]` | Centered nav links, shown above the social row |
| `socialLinks` | `SocialLink[]` | `[]` | Social icon links, shown below `navLinks` |
| `copyright` | `string` | – | Copyright line, shown last |
| `className` | `string` | – | Extra classes for the outer `<footer>` |

```ts
type Logo = { text?: string; href?: string };
type NavLink = { label: string; href?: string };
type SocialLink = {
  icon: "twitter" | "github" | "linkedin";
  href?: string;
  label?: string;
};
```

## Behavior notes

- All four blocks (logo, `navLinks`, `socialLinks`, `copyright`) stack in that fixed order, each separated by `mt-8`, and each section is only rendered when its data is present.
- `SocialLink.icon` is a closed union of `"twitter" | "github" | "linkedin"`; only those three Lucide icons are wired into the `socialIcons` map, so any other value needs the component edited to add it.
- Social icons render as plain text-color links (`size-5`, no circular button chrome), unlike footer23's large filled circles. `social.label` is passed as the link's `aria-label`, not visible text.
