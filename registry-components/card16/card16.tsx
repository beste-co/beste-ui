import { cn } from "@/lib/utils";

type Tone = "light" | "primary";

interface Card16Props {
  /** Photo URLs; the first is on top, up to two more peek from behind */
  images: string[];
  /** Title over the bottom scrim */
  title?: string;
  /** Count chip in the top right (e.g. "24 photos") */
  count?: string;
  /** If set, the whole stack links to this href */
  href?: string;
  /** Count chip color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  light: "bg-white text-black",
  primary: "bg-primary text-primary-foreground",
};

export const card16Demo: Card16Props = {
  images: [
    "https://images.unsplash.com/photo-1782174177406-d36704027953?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop",
  ],
  title: "Studio offsite",
  count: "24 photos",
  href: "#",
};

/**
 * A photo stack: the top image sits on two tucked prints that fan out on
 * hover like a loose pile of photographs. Built for album and gallery
 * entries; the whole stack links out when href is set.
 */
export function Card16({ images, title, count, href, tone = "light", className }: Card16Props) {
  const [top, second, third] = images;
  if (!top) return null;

  const inner = (
    <>
      {third && (
        <span className="absolute inset-0 rotate-6 overflow-hidden rounded-xl border-4 border-white bg-zinc-200 shadow-md transition-transform duration-500 ease-out motion-safe:group-hover/card16:rotate-12 motion-safe:group-hover/card16:translate-x-4">
          <img src={third} alt="" className="absolute inset-0 size-full object-cover" />
        </span>
      )}
      {second && (
        <span className="absolute inset-0 -rotate-3 overflow-hidden rounded-xl border-4 border-white bg-zinc-200 shadow-md transition-transform duration-500 ease-out motion-safe:group-hover/card16:-rotate-8 motion-safe:group-hover/card16:-translate-x-4">
          <img src={second} alt="" className="absolute inset-0 size-full object-cover" />
        </span>
      )}

      <span className="absolute inset-0 overflow-hidden rounded-xl border-4 border-white bg-zinc-200 shadow-lg transition-transform duration-500 ease-out motion-safe:group-hover/card16:scale-[1.02]">
        <img src={top} alt={title ?? ""} className="absolute inset-0 size-full object-cover" />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        />
        {count && (
          <span
            className={cn(
              "absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-sm font-semibold shadow-sm",
              toneStyles[tone]
            )}
          >
            {count}
          </span>
        )}
        {title && (
          <span className="absolute inset-x-0 bottom-0 p-4 text-lg font-semibold tracking-tight text-white">
            {title}
          </span>
        )}
      </span>
    </>
  );

  const classes = cn(
    "group/card16 relative block aspect-square w-full max-w-sm",
    href &&
      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className
  );

  if (href) {
    return (
      <a href={href} aria-label={title ?? "Open gallery"} className={classes}>
        {inner}
      </a>
    );
  }

  return <div className={classes}>{inner}</div>;
}
