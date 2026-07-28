# Settings64: Invoice History Table

Billing history table for an account or settings page: a header with a billing badge, a shadcn `Table` of past invoices with colored status badges (paid, pending, failed) and a per-row download button, an empty state when there are no invoices, and an optional "view all" link.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/settings64"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/settings64"
```

This installs the block to `components/beste/block/settings64.tsx` and the `badge`, `button`, and `table` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `settings64Demo` alongside the block: the exact props behind the preview above. Spread it to get a working billing table in one line.

```tsx
import { Settings64, settings64Demo } from "@/components/beste/block/settings64";

export default function BillingPage() {
  return <Settings64 {...settings64Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Settings64 } from "@/components/beste/block/settings64";

export default function BillingPage() {
  return (
    <Settings64
      badge={{ label: "Billing", variant: "secondary" }}
      heading="Billing History"
      description="View and download your past invoices and payment history."
      invoices={[
        {
          date: "Jan 1, 2024",
          amount: "$29.00",
          status: "paid",
          description: "Pro Plan - Monthly",
          invoiceNumber: "INV-2024-001",
          downloadUrl: "https://beste.co",
        },
        {
          date: "Dec 1, 2023",
          amount: "$29.00",
          status: "failed",
          description: "Pro Plan - Monthly",
          invoiceNumber: "INV-2023-012",
        },
      ]}
      labels={{
        date: "Date",
        description: "Description",
        amount: "Amount",
        status: "Status",
        paid: "Paid",
        failed: "Failed",
        download: "Download",
      }}
      viewAllUrl="https://beste.co"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `invoices` | `Invoice[]` | `[]` | Rows rendered in the table, in order |
| `labels` | `Labels` | `{}` | Every user-visible table string, for i18n |
| `viewAllUrl` | `string` | – | Link for the "view all" button below the table; button is hidden without it |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Invoice = {
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  description: string;
  invoiceNumber: string;
  downloadUrl?: string;
};

type Labels = {
  date?: string;
  description?: string;
  amount?: string;
  status?: string;
  paid?: string;
  pending?: string;
  failed?: string;
  download?: string;
  noInvoices?: string;
  viewAll?: string;
};
```

## Behavior notes

- Status badges use hardcoded status colors rather than the semantic palette: emerald for `paid`, amber for `pending`, rose for `failed`, each paired with a matching icon (`CheckCircle`, `Clock`, `XCircle`).
- A row's download button is a real link (`asChild` around `<Link>`) when `downloadUrl` is set; when it's missing, the same icon button renders with the `disabled` attribute instead of being hidden, so the column stays visually aligned.
- When `invoices` is empty, the table is replaced entirely by a centered empty-state card with a `FileText` icon and the `labels.noInvoices` string.
- The "view all" button only renders when both `invoices.length > 0` and `viewAllUrl` are set; supplying only one of the two hides it.
- Every table header and status label comes from the `labels` object with no internal fallback text, so omitting a key renders that cell blank.
