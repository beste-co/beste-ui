import { cn } from "@/lib/utils";

type Tone = "primary" | "emerald" | "rose";

interface Card23Props {
  /** Portrait photo URL */
  src: string;
  /** Person's name */
  name: string;
  /** Role under the name */
  role?: string;
  /** Company or event name at the top of the badge */
  company?: string;
  /** Colored access tag (defaults to "Staff") */
  tag?: string;
  /** Code under the barcode, also seeds the bar pattern */
  code?: string;
  /** Lanyard and tag color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, { strap: string; tag: string }> = {
  primary: { strap: "bg-primary", tag: "bg-primary text-primary-foreground" },
  emerald: { strap: "bg-emerald-600", tag: "bg-emerald-600 text-white" },
  rose: { strap: "bg-rose-500", tag: "bg-rose-500 text-white" },
};

export const card23Demo: Card23Props = {
  src: "https://i.pravatar.cc/160?img=32",
  name: "Deniz Arslan",
  role: "Creative Director",
  company: "Beste Conf 2027",
  tag: "Speaker",
  code: "ATT-0087",
};

/**
 * A conference lanyard badge: strap and metal clip up top, punched slot,
 * portrait, name, role, and a barcode. The whole badge sways gently from
 * its clip on hover.
 */
export function Card23({
  src,
  name,
  role,
  company,
  tag = "Staff",
  code,
  tone = "primary",
  className,
}: Card23Props) {
  const seed = code && code.length > 0 ? code : name;
  const bars = Array.from(
    { length: 24 },
    (_, i) => 1 + ((seed.charCodeAt(i % seed.length) + i * 5) % 3)
  );
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "flex w-full max-w-56 origin-top flex-col items-center transition-transform duration-500 ease-out motion-safe:hover:rotate-2",
        className
      )}
    >
      {/* Strap and clip */}
      <span aria-hidden="true" className={cn("h-9 w-7", styles.strap)} />
      <span
        aria-hidden="true"
        className="z-10 -mt-1.5 h-3.5 w-10 rounded-sm border border-zinc-400 bg-gradient-to-b from-zinc-200 to-zinc-400 shadow-sm"
      />

      {/* Badge */}
      <div className="-mt-1 flex w-full flex-col items-center rounded-xl border bg-card p-5 pt-4 shadow-md">
        <span aria-hidden="true" className="h-1.5 w-9 rounded-full bg-muted shadow-inner" />

        {company && (
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {company}
          </p>
        )}
        <img
          src={src}
          alt=""
          width={80}
          height={80}
          className="mt-3 size-20 rounded-lg object-cover"
        />
        <p className="mt-3 text-center text-base font-bold tracking-tight text-card-foreground">
          {name}
        </p>
        {role && <p className="text-center text-sm text-muted-foreground">{role}</p>}
        <span
          className={cn(
            "mt-3 rounded-full px-3 py-0.5 text-sm font-semibold uppercase tracking-wide",
            styles.tag
          )}
        >
          {tag}
        </span>

        <span aria-hidden="true" className="mt-4 flex h-6 w-32 items-stretch justify-between">
          {bars.map((w, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: bars are static decoration
              key={i}
              className="h-full bg-foreground"
              style={{ width: w }}
            />
          ))}
        </span>
        {code && (
          <p className="mt-1 font-mono text-sm tracking-[0.25em] text-muted-foreground">{code}</p>
        )}
      </div>
    </div>
  );
}
