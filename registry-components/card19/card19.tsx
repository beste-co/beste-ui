import { cn } from "@/lib/utils";

type Tone = "ink" | "primary" | "paper";

interface Card19Props {
  /** Book title */
  title: string;
  /** Author line above the title */
  author?: string;
  /** Small line at the bottom of the cover (e.g. "Second edition") */
  note?: string;
  /** Cover art URL; the cover stays typographic when omitted */
  src?: string;
  /** If set, the whole book links to this href */
  href?: string;
  /** Cover color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  ink: "bg-zinc-900 text-white",
  primary: "bg-primary text-primary-foreground",
  paper: "border border-black/10 bg-amber-50 text-zinc-900",
};

export const card19Demo: Card19Props = {
  title: "The Component Handbook",
  author: "Beste Studio",
  note: "Second edition",
};

/**
 * A 3D book: the cover swings open from its spine on hover (or keyboard
 * focus when linked), revealing the page block underneath. Page edges are
 * drawn with a repeating gradient, so no assets are needed.
 */
export function Card19({ title, author, note, src, href, tone = "ink", className }: Card19Props) {
  const inner = (
    // The cover must be a direct child of the element carrying perspective,
    // otherwise the rotateY renders flat and the open-book depth is lost.
    <span className="relative block size-full [perspective:1000px]">
      {/* Page block; peeks past the cover on the right so the closed book
          already reads as having thickness */}
      <span
        aria-hidden="true"
        className="absolute -right-1.5 inset-y-1 left-3 rounded-r-md shadow-sm"
        style={{
          background: "repeating-linear-gradient(to bottom, #ffffff 0 3px, #e4e4e7 3px 4px)",
        }}
      />

      {/* Cover, hinged on the spine */}
      <span
        className={cn(
          "absolute inset-0 flex origin-left flex-col justify-between overflow-hidden rounded-l-sm rounded-r-md p-5 shadow-md transition-all duration-500 ease-out motion-safe:group-hover/card19:[transform:rotateY(-38deg)] motion-safe:group-focus-visible/card19:[transform:rotateY(-38deg)] group-hover/card19:shadow-2xl",
          toneStyles[tone]
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
        {/* Spine shading */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 to-transparent"
        />
        <span className="relative font-mono text-sm uppercase tracking-widest opacity-70">
          {author}
        </span>
        <span className="relative">
          <span className="block font-serif text-2xl leading-tight tracking-tight">{title}</span>
          {note && (
            <span className="mt-3 block border-t border-current/20 pt-2 font-mono text-sm uppercase tracking-widest opacity-60">
              {note}
            </span>
          )}
        </span>
      </span>
    </span>
  );

  const classes = cn(
    "group/card19 block aspect-[3/4] w-full max-w-60",
    href &&
      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
    className
  );

  if (href) {
    return (
      <a href={href} aria-label={title} className={classes}>
        {inner}
      </a>
    );
  }

  return <div className={classes}>{inner}</div>;
}
