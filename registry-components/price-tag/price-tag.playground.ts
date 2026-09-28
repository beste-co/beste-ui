/**
 * Playground for `price-tag`: the amount, how it is written and the old price beside it.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "amount", label: "Amount", kind: "slider", min: 0, max: 500, step: 0.5, group: "Price" },
    { prop: "compareAt", label: "Compare at", kind: "slider", min: 0, max: 600, step: 1, group: "Price" },
    { prop: "currency", label: "Currency", kind: "select", options: ["USD", "EUR", "GBP", "JPY", "TRY"], default: "USD", group: "Price" },
    { prop: "locale", label: "Locale", kind: "select", options: ["en-US", "de-DE", "fr-FR", "ja-JP", "tr-TR"], group: "Price" },
    { prop: "period", label: "Period", kind: "text", placeholder: "/mo", group: "Price" },
    { prop: "showSavings", label: "Savings chip", kind: "switch", default: true, group: "Price" },
    { prop: "symbol", label: "Symbol", kind: "segmented", options: ["inline", "raised"], default: "inline", group: "Layout" },
    { prop: "cents", label: "Cents", kind: "segmented", options: ["inline", "raised"], default: "inline", group: "Layout" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
