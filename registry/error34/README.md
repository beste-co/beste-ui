# Error34: Editorial Not Found Split

Calm not-found page: an error eyebrow over an oversized light heading, a reassuring line and two recovery actions on the left, beside a hairline list of the destinations people usually needed instead, each with its own one-line explanation and a hover arrow.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/error34"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/error34"
```

This installs the block to `components/beste/block/error34.tsx` plus the `badge23` and `button21` components it uses for the eyebrow and the actions.

## Quick start

The installed file exports `error34Demo` alongside the block: the exact props behind the preview above. Spread it to get a working 404 in one line.

```tsx
import { Error34, error34Demo } from "@/components/beste/block/error34";

export default function NotFound() {
  return <Error34 {...error34Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Error34 } from "@/components/beste/block/error34";

export default function NotFound() {
  return (
    <Error34
      badge={{ label: "Error 404" }}
      heading="This page moved, or never existed"
      description="Nothing is broken on your side, and your workspace is untouched."
      buttons={[
        { label: "Back to home", href: "/" },
        { label: "Search the docs", href: "/docs", tone: "outline" },
      ]}
      linksLabel="Where people usually go from here"
      links={[
        {
          title: "Product tour",
          description: "See how the whole workflow sits on one surface.",
          href: "/tour",
        },
        {
          title: "Help centre",
          description: "Setup guides, imports, and answers from the team.",
          href: "/help",
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Error eyebrow above the heading, rendered via `Badge23` |
| `heading` | `string` | – | Oversized `h1` explaining what happened |
| `description` | `string` | – | Reassuring paragraph under the heading |
| `buttons` | `ActionLink[]` | `[]` | Recovery actions, each with its own tone |
| `linksLabel` | `string` | – | Label above the destination list |
| `links` | `HelpLink[]` | `[]` | Hairline rows of likely destinations |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ActionLink = {
  label: string;
  href: string;
  tone?: "primary" | "neutral" | "outline";
};

type HelpLink = { title: string; description: string; href: string };
```

## Behavior notes

- The status code lives in `badge.label`, not in a giant `404` numeral, so the heading can carry the sentence a lost visitor actually needs and the code stays a quiet kicker.
- The heading is an `h1` at the set's hero scale. Dropping this block into a page that already has an `h1` means overriding one of them for a sane outline.
- Each destination row is a `next/link` around the whole row, with the title, its description, and the arrow all reacting from one named group, so the hit target is the full strip rather than the title alone.
- `buttons` renders through `Button21` with the tone taken from the data, which is how the demo gets a solid first action and a hairline second without a variant prop on the block.
- Nothing is client-interactive here beyond the links, and nothing reads the router, so this drops straight into a `not-found.tsx` on the server.
- Both columns are independent: leaving `links` empty leaves the left column alone, and the `md:grid-cols-2` split simply renders with an empty right side.
