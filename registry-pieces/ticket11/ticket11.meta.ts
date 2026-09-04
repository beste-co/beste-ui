import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "ticket11",
  title: "Ticket Scan",
  description:
    "Event ticket whose barcode is swept by a scanner line until it clears, flips to a checked in confirmation, then resets for the next guest.",
  category: "Ticket",
};
