# Auth3: Email Verification Code

Full-height OTP screen: a centered icon badge, a segmented six-digit code input, a verify button that stays disabled until the code is complete, and a live resend countdown that flips into a clickable "resend" prompt once it hits zero.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/auth3"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/auth3"
```

This installs the block to `components/beste/block/auth3.tsx` and the `button`, `input-otp`, and `field` shadcn/ui primitives it's built on.

## Quick start

The installed file exports `auth3Demo` alongside the block: the exact props behind the preview above. Spread it to get a working verification screen in one line.

```tsx
import { Auth3, auth3Demo } from "@/components/beste/block/auth3";

export default function VerifyPage() {
  return <Auth3 {...auth3Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { MailCheck } from "lucide-react";
import { Auth3 } from "@/components/beste/block/auth3";

export default function VerifyPage() {
  return (
    <Auth3
      icon={<MailCheck className="size-6" />}
      heading="Check your email"
      description="Enter the 6-digit code we sent to <strong>jane@example.com</strong>"
      otpLength={6}
      resendSeconds={30}
      resendPrompt={{ text: "Didn't get the code?", linkLabel: "Resend" }}
      backLink={{ label: "Back to sign in", href: "/sign-in" }}
      labels={{ verify: "Verify email" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | – | Icon shown inside the circular badge above the heading |
| `heading` | `string` | – | Screen title |
| `description` | `string` | – | Subtext below the heading; supports an inline `<strong>` (rendered as HTML) |
| `otpLength` | `number` | `6` | Number of OTP slots |
| `resendPrompt` | `{ text: string; linkLabel: string }` | – | Text and button label shown once the countdown reaches zero |
| `resendSeconds` | `number` | `30` | Countdown length in seconds before resend becomes available |
| `backLink` | `{ label: string; href: string }` | – | Link below the card, hidden entirely when not set |
| `labels` | `{ verify?: string; resendCountdown?: string }` | `{}` | Verify button label and countdown template (`{seconds}` placeholder) |
| `className` | `string` | – | Extra classes for the outer `<section>` |

## Behavior notes

- `description` is rendered with `dangerouslySetInnerHTML`, which is why the demo embeds the email address in a literal `<strong>` tag rather than a separate prop.
- The verify `Button` is `disabled` until `code.length === otpLength`; there is no `onSubmit` prop, so the form only calls `e.preventDefault()`, meaning the integrator still has to wire up the actual verification call.
- The countdown is local state driven by a `useEffect`/`setTimeout` loop that ticks `secondsLeft` down every second; while it is above zero, `labels.resendCountdown` (default `"Resend code in {seconds}s"`) replaces the literal `{seconds}` token with the live value.
- Once the countdown hits zero, the countdown text is swapped for `resendPrompt.text` plus a clickable resend button; clicking it clears the entered code and resets the timer back to `resendSeconds`, but does not call any prop or fire a network request, it is purely local state reset.
- `code` is a fully controlled string driven by `InputOTP`'s `onChange`, so there's no prop to read the value from outside the component; a real integration needs to lift this state or wrap the block.

<Callout type="info" title="Wiring the form up">
This block ships the form markup only; state, validation, and submit are yours to add. Our guide wires the shadcn `Field` primitives to [React Hook Form, TanStack Form, and Formisch](/blog/shadcn-forms-react-hook-form-tanstack-formisch) on one field system.
</Callout>
