# Error35: Server Error With Live Status

A calm server-error page with a monospace code, an oversized light heading, recovery actions, an image tile floating a live uptime strip and a hairline table carrying the incident reference.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/error35"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/error35"
```

This installs the block to `components/beste/block/error35.tsx`, the `indicator14` uptime piece it floats on the tile (installed to `components/beste/piece/indicator14.tsx`), and the `button21` component it uses for the actions.

## Quick start

The installed file exports `error35Demo` alongside the block: the exact props behind the preview above. Spread it to get a working error page in one line.

```tsx
import { Error35, error35Demo } from "@/components/beste/block/error35";

export default function ErrorPage() {
  return <Error35 {...error35Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Error35 } from "@/components/beste/block/error35";
import { Indicator14 } from "@/components/beste/piece/indicator14";

export default function ErrorPage() {
  return (
    <Error35
      code="Error 500"
      heading="That one is ours, not yours"
      description="Nothing you were working on has been lost, and the request has already been reported."
      buttons={[
        { label: "Try again", href: "/" },
        { label: "Back to the workspace", href: "/app" },
      ]}
      references={[
        { label: "Reference", value: "SIR-9F4C-2201" },
        { label: "Time", value: "14 May 2026, 09:41 UK" },
      ]}
      media={<Indicator14 title="Booking service" uptime="99.98%" range="Last 45 days" />}
      image={{ src: "/backdrops/blue.jpg", alt: "Soft blue gradient backdrop" }}
      footnote="Quote the reference above if you write to us."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | – | Small status line above the heading |
| `heading` | `string` | – | Error heading, rendered as the page `h1` |
| `description` | `string` | – | Centered supporting paragraph, capped at `max-w-xl` |
| `buttons` | `ActionLink[]` | `[]` | Recovery actions, first solid and the rest outlined |
| `references` | `Reference[]` | `[]` | Incident details in a hairline table |
| `media` | `ReactNode` | – | Live asset on the tile, `indicator14` in the demo |
| `image` | `{ src: string; alt: string }` | – | Backdrop behind the media tile |
| `footnote` | `string` | – | Small line under the reference table |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type ActionLink = {
  label: string;
  href: string;
};

type Reference = {
  label: string;
  value: string;
};
```

## Behavior notes

- Reference values keep `font-mono`, which is deliberate: an incident id is a token to be copied character by character, and a fixed-width face makes it readable over the phone.
- The reference table is a real `dl`, and it renders whatever strings you pass. Wiring it to a real error boundary means passing the caught request id through as `references`.
- Both actions are links rather than buttons, including "Try again", so the block stays free of client-side retry logic. Point it at the current path if you want a reload.
- Button tones are positional and not overridable: the first is `primary`, later ones are `outline`.
- The tile and the table share the same `max-w-3xl` cap while the copy above sits at `max-w-2xl`, which keeps the page centered without three different widths competing.
- The uptime strip is presentational here. It shows service history rather than the state of the current request, which is why it sits below the recovery actions rather than above them.
- Rows carry `border-t` with `last:border-b`, closing the table at the bottom.
