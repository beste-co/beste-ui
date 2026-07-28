import { cn } from "@/lib/utils";

type Tone = "dark" | "primary" | "neutral";

interface Card11Detail {
  label: string;
  value: string;
}

interface Card11Props {
  /** Monospace eyebrow (e.g. "Admit one") */
  eyebrow?: string;
  /** Event name */
  event: string;
  /** Ticket holder name */
  holder?: string;
  /** Detail columns (e.g. date, seat, gate) */
  details?: Card11Detail[];
  /** Code printed on the stub, also seeds the barcode */
  code?: string;
  /** Surface tone */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, { root: string; muted: string; divider: string }> = {
  dark: {
    root: "bg-foreground text-background",
    muted: "text-background/60",
    divider: "border-background/30",
  },
  primary: {
    root: "bg-primary text-primary-foreground",
    muted: "text-primary-foreground/70",
    divider: "border-primary-foreground/30",
  },
  neutral: {
    root: "border bg-card text-card-foreground",
    muted: "text-muted-foreground",
    divider: "border-border",
  },
};

export const card11Demo: Card11Props = {
  eyebrow: "Admit one",
  event: "Beste Conf 2027",
  holder: "Selin Aksoy",
  details: [
    { label: "Date", value: "Mar 14" },
    { label: "Seat", value: "A12" },
    { label: "Gate", value: "03" },
  ],
  code: "BST-0421",
};

/**
 * An event ticket: main section plus a perforated stub, with punched notches
 * cut out of the surface via a CSS mask so the page background shows through.
 * The barcode pattern derives deterministically from the code.
 */
export function Card11({
  eyebrow,
  event,
  holder,
  details = [],
  code,
  tone = "dark",
  className,
}: Card11Props) {
  const seed = code && code.length > 0 ? code : event;
  const bars = Array.from({ length: 18 }, (_, i) => 1 + ((seed.charCodeAt(i % seed.length) + i * 5) % 3));

  // Two radial holes punched at the perforation line, one per edge
  const notchMask = [
    "radial-gradient(circle 9px at calc(100% - 6rem) 0, transparent 9px, black 9.5px)",
    "radial-gradient(circle 9px at calc(100% - 6rem) 100%, transparent 9px, black 9.5px)",
  ].join(", ");

  const styles = toneStyles[tone];

  return (
    <div
      className={cn("flex w-full max-w-sm rounded-2xl", styles.root, className)}
      style={{
        WebkitMaskImage: notchMask,
        WebkitMaskComposite: "source-in",
        maskImage: notchMask,
        maskComposite: "intersect",
      }}
    >
      {/* Main section */}
      <div className="min-w-0 flex-1 p-5">
        {eyebrow && (
          <p className={cn("font-mono text-sm uppercase tracking-[0.25em]", styles.muted)}>
            {eyebrow}
          </p>
        )}
        <h3 className="mt-1.5 truncate text-xl font-bold tracking-tight">{event}</h3>
        {holder && <p className={cn("mt-0.5 truncate text-sm", styles.muted)}>{holder}</p>}

        {details.length > 0 && (
          <dl className="mt-5 flex gap-6">
            {details.map((d) => (
              <div key={d.label} className="min-w-0">
                <dt
                  className={cn(
                    "font-mono text-sm uppercase tracking-widest",
                    styles.muted
                  )}
                >
                  {d.label}
                </dt>
                <dd className="mt-0.5 truncate text-base font-semibold">{d.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Perforated stub */}
      <div
        className={cn(
          "flex w-24 shrink-0 flex-col items-center justify-center gap-3 border-l border-dashed p-3",
          styles.divider
        )}
      >
        <span aria-hidden="true" className="flex h-16 w-8 flex-col justify-between">
          {bars.map((h, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: bars are static decoration
              key={i}
              className="w-full bg-current"
              style={{ height: h }}
            />
          ))}
        </span>
        {code && (
          <span className="font-mono text-sm tracking-widest [writing-mode:vertical-rl]">
            {code}
          </span>
        )}
      </div>
    </div>
  );
}
