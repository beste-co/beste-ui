# Error7: 404 Notice Card

A compact bordered card holding the whole error state: a circular icon, a status label, the heading, one line of explanation, and full-width stacked buttons. Narrow enough to drop inside an app shell or a dialog as well as on a full page.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/error7"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/error7"
```

This installs the block to `components/beste/block/error7.tsx`, plus the `button` shadcn/ui primitive it uses for the stacked action buttons.

## Quick start

The installed file exports `error7Demo` alongside the block: the exact props behind the preview above. Spread it to get a working card in one line.

```tsx
import { Error7, error7Demo } from "@/components/beste/block/error7";

export default function NotFound() {
  return <Error7 {...error7Demo} />;
}
```

The icon is a Lucide component passed as a prop, so any icon works:

```tsx
import { FileQuestion } from "lucide-react";
import { Error7 } from "@/components/beste/block/error7";

export default function NotFound() {
  return (
    <Error7
      icon={FileQuestion}
      code="Error 404"
      heading="Page not found"
      description="We looked, but there is nothing at this address."
      buttons={[
        { label: "Back to home", href: "/" },
        { label: "Contact support", href: "/support", variant: "ghost" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `LucideIcon` | – | Icon rendered in the circular chip at the top of the card |
| `code` | `string` | – | Small uppercase status label above the heading |
| `heading` | `string` | – | Card heading, rendered as an `h1` |
| `description` | `string` | – | Explanatory line under the heading |
| `buttons` | `ActionButton[]` | `[]` | Stacked full-width buttons at the bottom of the card |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ActionButton = {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  icon?: LucideIcon;
};
```

## Behavior notes

- The card is capped at `max-w-md` and centered, so it keeps its compact proportions no matter how wide the page container is.
- Buttons stack vertically at full width rather than sitting in a row, which keeps the card readable at narrow widths and inside modals.
- Each button can carry its own Lucide `icon`, rendered before the label, and its own shadcn variant, so a primary and a quiet action can sit together.
- The block is static markup with no client state, so it renders on the server and works with JavaScript disabled.
