import { cn } from "@/lib/utils";

type Tone = "ink" | "primary";

interface Card14Item {
  label: string;
  value: string;
}

interface Card14Props {
  /** Store or studio name, printed uppercase at the top */
  store: string;
  /** Muted line under the store name (e.g. an invoice number or date) */
  meta?: string;
  /** Itemized rows */
  items: Card14Item[];
  /** Total row value */
  total: string;
  /** Total row label (defaults to "Total") */
  totalLabel?: string;
  /** Centered footer note */
  note?: string;
  /** Seeds the barcode at the bottom; omit to hide it */
  code?: string;
  /** Accent on the store name and total */
  tone?: Tone;
  /** Slight paper rotation (defaults to on) */
  tilted?: boolean;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  ink: "text-zinc-900",
  primary: "text-primary",
};

export const card14Demo: Card14Props = {
  store: "Beste Studio",
  meta: "INV-2026-0142 * Jul 02",
  items: [
    { label: "Landing page", value: "$1,900" },
    { label: "Brand refresh", value: "$2,400" },
    { label: "Rush delivery", value: "$350" },
  ],
  total: "$4,650",
  note: "* Thank you, see you again *",
  code: "INV-2026-0142",
};

/**
 * A thermal receipt: fixed white paper with monospace type, dotted leader
 * rows, a dashed total rule, a deterministic barcode, and a zigzag torn
 * bottom edge drawn with a repeating conic gradient.
 */
export function Card14({
  store,
  meta,
  items,
  total,
  totalLabel = "Total",
  note,
  code,
  tone = "ink",
  tilted = true,
  className,
}: Card14Props) {
  const seed = code && code.length > 0 ? code : store;
  const bars = Array.from(
    { length: 32 },
    (_, i) => 1 + ((seed.charCodeAt(i % seed.length) + i * 3) % 3)
  );

  return (
    <div className={cn("w-full max-w-xs", tilted && "-rotate-1", className)}>
      {/* Paper is intentionally fixed white so it reads as a printed receipt
          on both site themes */}
      <div className="bg-white px-5 pb-6 pt-6 font-mono text-zinc-900 shadow-md">
        <p
          className={cn(
            "text-center text-base font-bold uppercase tracking-[0.25em]",
            toneStyles[tone]
          )}
        >
          {store}
        </p>
        {meta && (
          <p className="mt-1 text-center text-sm uppercase tracking-widest text-zinc-500">
            {meta}
          </p>
        )}

        <div className="my-4 border-t border-dashed border-zinc-300" />

        <div className="flex flex-col gap-1.5">
          {items.map((item) => (
            <div key={item.label} className="flex items-baseline gap-2 text-sm">
              <span className="shrink-0 uppercase">{item.label}</span>
              <span
                aria-hidden="true"
                className="mb-0.5 min-w-4 flex-1 border-b border-dotted border-zinc-400"
              />
              <span className="shrink-0 tabular-nums">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-dashed border-zinc-300 pt-3">
          <div
            className={cn(
              "flex items-baseline justify-between text-base font-bold uppercase tracking-wide",
              toneStyles[tone]
            )}
          >
            <span>{totalLabel}</span>
            <span className="tabular-nums">{total}</span>
          </div>
        </div>

        {note && (
          <p className="mt-4 text-center text-sm uppercase tracking-widest text-zinc-500">
            {note}
          </p>
        )}

        {code && (
          <div className="mt-4 flex flex-col items-center gap-1.5">
            <span aria-hidden="true" className="flex h-8 w-40 items-stretch justify-between">
              {bars.map((w, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: bars are static decoration
                  key={i}
                  className="h-full bg-zinc-900"
                  style={{ width: w }}
                />
              ))}
            </span>
            <span className="text-sm tracking-[0.3em] text-zinc-500">{code}</span>
          </div>
        )}
      </div>

      {/* Torn zigzag edge */}
      <div
        aria-hidden="true"
        className="h-2.5 w-full"
        style={{
          background: "conic-gradient(from 315deg at 50% 100%, #fff 90deg, transparent 0) 0 0 / 20px 10px repeat-x",
          filter: "drop-shadow(0 2px 2px rgb(0 0 0 / 0.08))",
        }}
      />
    </div>
  );
}
