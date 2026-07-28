# Error2: 404 With Site Search

A 404 page that treats search as the primary recovery path: a controlled input with a submit handler sits directly under the heading, followed by a bordered list of suggested destinations with titles, descriptions, and hover arrows.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/error2"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/error2"
```

This installs the block to `components/beste/block/error2.tsx`, plus the `button` and `input` shadcn/ui primitives it uses for the search form.

## Quick start

The installed file exports `error2Demo` alongside the block: the exact props behind the preview above. Spread it to get a working 404 screen in one line.

```tsx
import { Error2, error2Demo } from "@/components/beste/block/error2";

export default function NotFound() {
  return <Error2 {...error2Demo} />;
}
```

Wire `onSearch` to your own search route and pass your own destinations:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Error2 } from "@/components/beste/block/error2";

export default function NotFound() {
  const router = useRouter();

  return (
    <Error2
      code="Error 404"
      heading="We could not find that page"
      description="Search the site instead, or jump to one of these pages."
      labels={{
        placeholder: "Search documentation",
        submit: "Search",
        suggestions: "Suggested pages",
      }}
      suggestions={[
        { title: "Getting started", description: "Install and ship", href: "/docs" },
        { title: "Support", description: "Get help from a human", href: "/support" },
      ]}
      onSearch={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
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
| `labels` | `Error2Labels` | `{}` | Search placeholder, submit button text, and suggestion list caption |
| `suggestions` | `SuggestionLink[]` | `[]` | Rows in the bordered suggestion list |
| `onSearch` | `(query: string) => void` | – | Called on form submit with the trimmed query |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Error2Labels = {
  placeholder?: string;
  submit?: string;
  suggestions?: string;
};

type SuggestionLink = {
  title: string;
  description?: string;
  href: string;
};
```

## Behavior notes

- The search field is a controlled React input. Submitting the form calls `event.preventDefault()` and passes the trimmed query to `onSearch`, so nothing navigates by default: routing is entirely up to the caller.
- Without an `onSearch` handler the form still submits harmlessly (the optional call is skipped), which keeps the block safe to drop in before search exists.
- The input is `type="search"`, so browsers render their native clear affordance, and the placeholder doubles as the field's `aria-label`.
- The submit button only renders when `labels.submit` is set, leaving an input-only search bar for compact layouts.
- The form stacks vertically on mobile and switches to a single row at the `sm` breakpoint; suggestion rows are separated by `divide-y` inside one bordered container and highlight on hover through the named `group/error2` group.
