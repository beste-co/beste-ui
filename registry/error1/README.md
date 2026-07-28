# Error1: Centered 404 Message

A minimal 404 page built around a single centered column: an oversized error code, the heading, a short explanation, a button row, and a divided footer of popular page links. Every string is a prop, so the same block covers 404, 403, and 500 screens.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/error1"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/error1"
```

This installs the block to `components/beste/block/error1.tsx`, plus the `button` shadcn/ui primitive it uses for the call-to-action row.

## Quick start

The installed file exports `error1Demo` alongside the block: the exact props behind the preview above. Spread it into Next.js's `not-found.tsx` to get a working error page in one line.

```tsx
import { Error1, error1Demo } from "@/components/beste/block/error1";

export default function NotFound() {
  return <Error1 {...error1Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { House } from "lucide-react";
import { Error1 } from "@/components/beste/block/error1";

export default function NotFound() {
  return (
    <Error1
      code="404"
      heading="This page could not be found"
      description="The page you are looking for was moved, renamed, or never existed."
      buttons={[
        { label: "Back to home", href: "/", icon: House },
        { label: "Contact support", href: "/support", variant: "outline" },
      ]}
      linksLabel="Popular pages"
      links={[
        { label: "Documentation", href: "/docs" },
        { label: "Pricing", href: "/pricing" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | – | Oversized status code shown above the heading |
| `heading` | `string` | – | Main page heading, rendered as an `h1` |
| `description` | `string` | – | Explanatory paragraph under the heading |
| `buttons` | `ActionButton[]` | `[]` | Call-to-action row under the description |
| `linksLabel` | `string` | – | Caption above the quick link row |
| `links` | `QuickLink[]` | `[]` | Quick links in the footer row |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ActionButton = {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  icon?: LucideIcon;
};

type QuickLink = {
  label: string;
  href: string;
};
```

## Behavior notes

- The whole block is static markup with no client state, so it renders fully on the server and works with JavaScript disabled.
- Each section is independently optional: the code, heading, description, button row, and the entire link footer only render when their prop is set (or, for arrays, non-empty), so a bare `heading` plus `buttons` is a valid configuration.
- Button icons come from the button data itself (`icon` is a Lucide component reference), so the icon side is fixed to the left of the label and there is no separate external-link flag.
- Quick links animate their trailing arrow 2px to the right on hover through the named `group/error1` group, so nesting this block inside another hover group will not trigger it.
