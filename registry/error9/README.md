# Error9: 404 Did You Mean

A left-aligned 404 for sites where URLs move: the address that failed is printed struck through in monospace, and directly beneath it a did-you-mean box links to the closest matching page.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/error9"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/error9"
```

This installs the block to `components/beste/block/error9.tsx`, plus the `button` shadcn/ui primitive it uses for the closing action.

## Quick start

The installed file exports `error9Demo` alongside the block: the exact props behind the preview above. Spread it to get a working page in one line.

```tsx
import { Error9, error9Demo } from "@/components/beste/block/error9";

export default function NotFound() {
  return <Error9 {...error9Demo} />;
}
```

Feed it the real pathname and whatever your redirect map suggests:

```tsx
"use client";

import { usePathname } from "next/navigation";
import { Error9 } from "@/components/beste/block/error9";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <Error9
      code="404"
      heading="That page moved"
      description="We could not match this address, but one page comes close."
      requestedPath={pathname}
      suggestionLabel="Did you mean"
      suggestion={{ label: "/docs/getting-started", href: "/docs/getting-started" }}
      button={{ label: "Back to home", href: "/" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | – | Small uppercase status label above the heading |
| `heading` | `string` | – | Main page heading, rendered as an `h1` |
| `description` | `string` | – | Explanatory paragraph under the heading |
| `requestedPath` | `string` | – | The address that failed, printed struck through in monospace |
| `suggestionLabel` | `string` | – | Lead-in text inside the suggestion box |
| `suggestion` | `ActionLink` | – | The closest matching page, linked from inside the box |
| `button` | `ActionLink` | – | Outline button at the bottom |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ActionLink = {
  label: string;
  href: string;
};
```

## Behavior notes

- The failed path is truncated with `truncate`, so a long URL shortens with an ellipsis instead of wrapping across lines and pushing the suggestion box down.
- The suggestion link itself uses `break-all`, so a long suggested path wraps inside the box rather than overflowing it.
- The suggestion box only renders when `suggestion` is set. `suggestionLabel` on its own renders nothing, which keeps the block usable as a plain 404 when no match was found.
- The block is static markup with no client state, so the suggestion has to be computed by the caller (a redirect table, a slug distance check) and passed in.
