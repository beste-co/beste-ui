import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "settings64",
  title: "Invoice History Table",
  description: "Billing history table displaying invoices with date, description, amount, payment status badges, and download buttons. Perfect for account billing pages and payment management dashboards.",
  category: "Settings",
  registryDependencies: ["badge","button","table"],
};
