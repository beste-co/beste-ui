import { cn } from "@/lib/utils";

type Tone = "ink" | "primary" | "sand";

interface Card17Props {
  /** Album title on the sleeve */
  title: string;
  /** Artist line above the title */
  artist?: string;
  /** Catalog number in the sleeve corner (e.g. "BST-004") */
  catalog?: string;
  /** Cover art URL; the sleeve stays typographic when omitted */
  src?: string;
  /** Sleeve color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, { sleeve: string; label: string }> = {
  ink: { sleeve: "bg-zinc-950 text-white", label: "bg-amber-100" },
  primary: { sleeve: "bg-primary text-primary-foreground", label: "bg-background" },
  sand: { sleeve: "border border-black/10 bg-amber-100 text-zinc-900", label: "bg-rose-200" },
};

export const card17Demo: Card17Props = {
  title: "Midnight Frequencies",
  artist: "Aurora Fields",
  catalog: "BST-004",
};

/**
 * A vinyl record in its sleeve: the disc peeks out at rest, then slides
 * halfway out and starts spinning on hover. The grooves are drawn with a
 * repeating radial gradient, so no image assets are needed.
 */
export function Card17({ title, artist, catalog, src, tone = "ink", className }: Card17Props) {
  const styles = toneStyles[tone];

  return (
    <div className={cn("group/card17 relative aspect-square w-full max-w-xs", className)}>
      {/* Disc */}
      <span
        aria-hidden="true"
        className="absolute inset-4 translate-x-[10%] rounded-full shadow-xl transition-transform duration-500 ease-out motion-safe:group-hover/card17:translate-x-[48%] motion-safe:group-hover/card17:animate-[spin_2.6s_linear_infinite]"
        style={{
          background: "repeating-radial-gradient(circle at center, #09090b 0 1.5px, #202024 1.5px 3px)",
        }}
      >
        {/* Sheen */}
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 40deg, transparent 0 30deg, rgb(255 255 255 / 0.07) 50deg, transparent 70deg, transparent 210deg, rgb(255 255 255 / 0.05) 230deg, transparent 250deg)",
          }}
        />
        {/* Center label */}
        <span
          className={cn(
            "absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full",
            styles.label
          )}
        />
        <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-100" />
      </span>

      {/* Sleeve */}
      <div
        className={cn(
          "relative z-10 flex size-full flex-col justify-between overflow-hidden rounded-md p-5 shadow-md",
          styles.sleeve
        )}
      >
        {src && (
          <>
            <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
            />
          </>
        )}
        <div className="relative flex items-start justify-between gap-2 font-mono text-sm uppercase tracking-widest opacity-70">
          <span className="truncate">{artist}</span>
          {catalog && <span className="shrink-0">{catalog}</span>}
        </div>
        <div className="relative">
          <h3 className="font-serif text-2xl leading-tight tracking-tight">{title}</h3>
          <p className="mt-2 font-mono text-sm uppercase tracking-widest opacity-60">
            Stereo / 33 RPM
          </p>
        </div>
      </div>
    </div>
  );
}
