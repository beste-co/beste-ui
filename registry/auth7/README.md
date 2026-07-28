# Auth7: Account Chooser

Full-height account picker: a heading and description above a bordered list of saved accounts (avatar, name, email, chevron), with a "use another account" row appended at the bottom and a legal note beneath the card. There are no form fields at all, every row is a link.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/auth7"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/auth7"
```

This installs the block to `components/beste/block/auth7.tsx` and the `avatar` and `field` shadcn/ui primitives it's built on.

## Quick start

The installed file exports `auth7Demo` alongside the block: the exact props behind the preview above. Spread it to get a working account chooser in one line.

```tsx
import { Auth7, auth7Demo } from "@/components/beste/block/auth7";

export default function ChooseAccountPage() {
  return <Auth7 {...auth7Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Auth7 } from "@/components/beste/block/auth7";

export default function ChooseAccountPage() {
  return (
    <Auth7
      heading="Choose an account"
      description="to continue to Acme"
      accounts={[
        { name: "Jane Cooper", email: "jane@example.com", href: "/session/jane" },
        { name: "Marcus Lee", email: "marcus@workmail.com", href: "/session/marcus" },
      ]}
      useAnotherAccount={{ label: "Use another account", href: "/sign-in" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Screen title |
| `description` | `string` | – | Subtext below the heading (e.g. "to continue to Acme") |
| `accounts` | `Account[]` | `[]` | Saved account rows, in list order |
| `useAnotherAccount` | `{ label: string; href: string }` | – | Extra row appended after the accounts, hidden entirely when not set |
| `labels` | `{ legal?: string }` | `{}` | Legal note below the card |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Account = {
  name: string;
  email: string;
  avatar?: { src: string; alt: string };
  href?: string;
};
```

## Behavior notes

- Every account row is a `next/link` to `account.href` (falls back to `"#"` if omitted); there is no `onSelect`/`onClick` prop, so picking an account only performs client-side navigation, there is no session-switch callback to hook into.
- `AvatarFallback` derives its initials from `account.name.split(" ").map(part => part[0]).join("")`, so it always has a sensible fallback even when `avatar` is omitted.
- The row's chevron icon translates right on hover via a named group (`group/auth7` / `group-hover/auth7:translate-x-0.5`), a subtle affordance rather than a full row-highlight animation (the row background itself just switches to `bg-muted` on hover).
- `labels.legal` is injected as raw HTML via `dangerouslySetInnerHTML`, so it can contain inline `<a>` tags (the demo links "Terms" and "Privacy Policy" this way) rather than separate link props.
- Unlike every other block in this family, there is no `<form>`, no password field, and no submit button; this screen is purely a navigation list.

<Callout type="info" title="Wiring the form up">
This block ships the form markup only; state, validation, and submit are yours to add. Our guide wires the shadcn `Field` primitives to [React Hook Form, TanStack Form, and Formisch](/blog/shadcn-forms-react-hook-form-tanstack-formisch) on one field system.
</Callout>
