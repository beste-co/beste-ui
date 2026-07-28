import { cn } from "@/lib/utils";

type Tone = "yellow" | "pink" | "mint" | "sky";

interface Card18Props {
  /** The note text */
  text: string;
  /** Small monospace line at the bottom (e.g. "PS: coffee is on me") */
  from?: string;
  /** Hide the push pin */
  unpinned?: boolean;
  /** Paper color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, { paper: string; fold: string }> = {
  yellow: { paper: "bg-yellow-200", fold: "bg-yellow-300" },
  pink: { paper: "bg-pink-200", fold: "bg-pink-300" },
  mint: { paper: "bg-emerald-200", fold: "bg-emerald-300" },
  sky: { paper: "bg-sky-200", fold: "bg-sky-300" },
};

export const card18Demo: Card18Props = {
  text: "Ship the landing page first. Everything else can wait until Monday.",
  from: "PS: coffee is on me",
};

/**
 * A sticky note pinned to the page: fixed pastel paper with a folded
 * bottom corner, a glossy push pin, and a slight tilt that straightens on
 * hover. Reads as a physical object on both themes.
 */
export function Card18({ text, from, unpinned = false, tone = "yellow", className }: Card18Props) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-64 rotate-1 transition-transform duration-300 ease-out motion-safe:hover:rotate-0",
        className
      )}
    >
      {!unpinned && (
        <span
          aria-hidden="true"
          className="absolute -top-2 left-1/2 z-10 size-5 -translate-x-1/2 rounded-full shadow-md"
          style={{
            background: "radial-gradient(circle at 30% 30%, #fca5a5, #ef4444 55%, #b91c1c)",
          }}
        />
      )}

      <div
        className={cn(
          "flex size-full flex-col justify-between p-6 pt-8 text-zinc-800 shadow-md",
          styles.paper
        )}
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)",
        }}
      >
        <p className="font-serif text-xl italic leading-snug">{text}</p>
        {from && (
          <p className="mt-4 font-mono text-sm uppercase tracking-widest text-zinc-700/70">
            {from}
          </p>
        )}
      </div>

      {/* Folded corner flap */}
      <span
        aria-hidden="true"
        className={cn("absolute bottom-0 right-0 size-6 shadow-sm", styles.fold)}
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />
    </div>
  );
}
