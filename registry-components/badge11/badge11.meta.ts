import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge11",
  title: "Barcode Badge",
  description:
    "A decorative barcode badge with a monospace caption for editorial and print inspired sections.",
  category: "Badge",
  usage: `import { Badge11 } from "@/components/beste/component/badge11";

<Badge11 label="Est. 2019, Berlin" />

<Badge11
  label="Serial No. 001"
  bars={36}         // number of bars (default 28)
  tone="muted"      // "foreground" (default) | "muted" | "primary"
  hideLabel         // bars only; label stays for screen readers
/>`,
};
