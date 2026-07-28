# Auth30: PIN Keypad Unlock

Full-height numeric lock screen: a row of dots that fill in as digits are entered, a 3x3 numeric keypad with a biometric shortcut and backspace flanking the 0 key, and an optional forgot-PIN link underneath.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/auth30"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/auth30"
```

This installs the block to `components/beste/block/auth30.tsx` and its dependencies.

## Quick start

The installed file exports `auth30Demo` alongside the block: the exact props behind the preview above. Spread it to get a working PIN lock screen in one line.

```tsx
import { Auth30, auth30Demo } from "@/components/beste/block/auth30";

export default function UnlockPage() {
  return <Auth30 {...auth30Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Auth30 } from "@/components/beste/block/auth30";

export default function UnlockPage() {
  return (
    <Auth30
      heading="Enter your PIN"
      description="Use your 4-digit PIN to unlock your account."
      pinLength={4}
      labels={{ biometric: "Use biometrics", backspace: "Delete" }}
      forgotPrompt={{ text: "Forgot your PIN?", linkLabel: "Reset it", href: "/reset-pin" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Screen title |
| `description` | `string` | – | Subtext below the heading |
| `pinLength` | `number` | `4` | Number of dots and the digit cap for the entered PIN |
| `labels` | `{ biometric?: string; backspace?: string }` | `{}` | `aria-label` text for the biometric and backspace buttons |
| `forgotPrompt` | `{ text: string; linkLabel: string; href: string }` | – | Line below the keypad, hidden entirely when not set |
| `className` | `string` | – | Extra classes for the outer `<section>` |

## Behavior notes

- The entered PIN is fully internal `useState<string>`; there is no `onChange`, `onComplete`, or any other callback prop, so the component never tells the outside world when the PIN reaches `pinLength` or what its value is. An integrator wiring this to real auth needs to fork the component to lift that state out.
- Digits are capped at `pinLength` by `append()`, but reaching the cap does nothing on its own, no auto-submit, no visual "complete" state beyond all dots being filled.
- The biometric button renders only when `labels.biometric` is set; it has an `aria-label` but no `onClick` handler at all, so it is purely decorative in the shipped code and needs to be wired up.
- The backspace button is `disabled` whenever the PIN is empty; digit buttons themselves have no disabled state once the PIN is full, they simply stop appending because `append()` checks the length.
- Digits 1-9 come from a mapped array in a `grid-cols-3` layout; 0 is a separate hardcoded button placed in the bottom row between the biometric shortcut and backspace, matching a standard phone keypad arrangement.
