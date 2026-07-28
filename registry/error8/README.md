# Error8: 404 With Redirect Countdown

A 404 page that does not wait for the visitor to act: a live countdown runs under the message and fires `onRedirect` when it reaches zero, with a cancel button that stops the timer for anyone who would rather stay.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/error8"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/error8"
```

This installs the block to `components/beste/block/error8.tsx`, plus the `button` shadcn/ui primitive it uses for the manual and cancel actions.

## Quick start

The installed file exports `error8Demo` alongside the block: the exact props behind the preview above. Spread it and the countdown runs immediately.

```tsx
import { Error8, error8Demo } from "@/components/beste/block/error8";

export default function NotFound() {
  return <Error8 {...error8Demo} />;
}
```

Navigation is the caller's job, so wire `onRedirect` to your router:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Error8 } from "@/components/beste/block/error8";

export default function NotFound() {
  const router = useRouter();

  return (
    <Error8
      code="404"
      heading="This page does not exist"
      description="We will take you somewhere useful unless you would rather stay."
      seconds={10}
      labels={{
        redirect: "Redirecting to the homepage in",
        seconds: "seconds",
        cancel: "Stay on this page",
        canceled: "Automatic redirect canceled.",
      }}
      action={{ label: "Go now", href: "/" }}
      onRedirect={() => router.push("/")}
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
| `seconds` | `number` | – | Starting value of the countdown |
| `labels` | `Error8Labels` | `{}` | Countdown sentence, unit word, cancel button text, and canceled message |
| `action` | `ActionLink` | – | Manual link button beside the cancel button |
| `onRedirect` | `() => void` | – | Called once when the countdown reaches zero |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Error8Labels = {
  redirect?: string;
  seconds?: string;
  cancel?: string;
  canceled?: string;
};

type ActionLink = {
  label: string;
  href: string;
};
```

## Behavior notes

- The block never navigates on its own. It only calls `onRedirect`, so the caller decides between `router.push`, `window.location`, or nothing at all, and the preview above stays put.
- `onRedirect` fires exactly once. A ref guards the call, so re-renders and a handler whose identity changes cannot trigger a second redirect.
- Passing no `seconds` (or `0`) disables the redirect entirely: the guard skips the call and the countdown never starts.
- Pressing cancel stops the timer permanently for that mount, swaps the countdown sentence for `labels.canceled`, and removes the cancel button, leaving only the manual action link.
- The countdown line is marked `aria-live="polite"`, so screen readers hear the remaining time without the page stealing focus every second.
