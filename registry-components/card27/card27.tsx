import { cn } from "@/lib/utils";

type Tone = "peach" | "violet" | "emerald";

interface Card27Props {
  /** Square thumbnail URL */
  src: string;
  /** Community or group name */
  title: string;
  /** Muted meta line (e.g. "312 members") */
  meta?: string;
  /** Organizer name in the bottom row */
  byName?: string;
  /** Organizer avatar URL; falls back to a gradient dot */
  bySrc?: string;
  /** If set, the whole card links to this href */
  href?: string;
  /** Gradient dot color when there is no organizer avatar */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  peach: "bg-gradient-to-br from-orange-300 to-rose-500",
  violet: "bg-gradient-to-br from-violet-300 to-purple-600",
  emerald: "bg-gradient-to-br from-emerald-300 to-teal-600",
};

export const card27Demo: Card27Props = {
  src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=400&auto=format&fit=crop",
  title: "Night Shippers",
  meta: "312 members",
  byName: "Deniz",
  href: "#",
};

/**
 * A compact community card: rounded thumbnail, name, member count, and an
 * organizer row with an avatar or gradient dot. The whole card links out
 * when href is set.
 */
export function Card27({
  src,
  title,
  meta,
  byName,
  bySrc,
  href,
  tone = "peach",
  className,
}: Card27Props) {
  return (
    <div
      className={cn(
        "relative w-full max-w-56 rounded-3xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <img
        src={src}
        alt=""
        width={80}
        height={80}
        className="size-20 rounded-2xl object-cover"
      />
      <h3 className="mt-4 truncate text-base font-semibold tracking-tight text-card-foreground">
        {href ? (
          <a
            href={href}
            className="rounded-sm before:absolute before:inset-0 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      {meta && <p className="mt-0.5 text-sm text-muted-foreground">{meta}</p>}
      {byName && (
        <p className="mt-2.5 flex items-center gap-2 text-sm text-card-foreground">
          {bySrc ? (
            <img
              src={bySrc}
              alt=""
              width={20}
              height={20}
              className="size-5 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className={cn("size-5 shrink-0 rounded-full", toneStyles[tone])}
            />
          )}
          By {byName}
        </p>
      )}
    </div>
  );
}
