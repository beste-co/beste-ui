# Error6: Inline 404 Line

The smallest error page in the set: the status code and the message sit side by side on one line, separated by a vertical rule that disappears on mobile, with a single outline button underneath. Nothing else competes for attention.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/error6"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/error6"
```

This installs the block to `components/beste/block/error6.tsx`, plus the `button` shadcn/ui primitive it uses for the single action.

## Quick start

The installed file exports `error6Demo` alongside the block: the exact props behind the preview above. Spread it into Next.js's `not-found.tsx` for a working error page in one line.

```tsx
import { Error6, error6Demo } from "@/components/beste/block/error6";

export default function NotFound() {
  return <Error6 {...error6Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Error6 } from "@/components/beste/block/error6";

export default function NotFound() {
  return (
    <Error6
      code="404"
      heading="This page could not be found"
      description="The link is broken or the page has been removed."
      link={{ label: "Back to home", href: "/" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | – | Status code shown at the start of the line |
| `heading` | `string` | – | Message text, rendered as an `h1` |
| `description` | `string` | – | Secondary line under the message |
| `link` | `ActionLink` | – | Single outline button below the line |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ActionLink = {
  label: string;
  href: string;
};
```

## Behavior notes

- The layout is a flex row that stacks into a centered column below the `sm` breakpoint, so the code sits above the message on phones instead of beside it.
- The vertical rule between the code and the message only renders when there is a `code` and at least one of `heading` or `description`, and it is hidden below `sm` where the layout is stacked.
- The block is static markup with no client state, so it renders on the server and works with JavaScript disabled.
- Every region is independently optional: with only `heading` and `link` set, the result is a one-line message with a button.
