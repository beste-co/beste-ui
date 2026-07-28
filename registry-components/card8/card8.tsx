import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground";

interface Card8Props {
  /** Portrait image URL */
  src: string;
  /** Person's name */
  name: string;
  /** Role or title */
  role: string;
  /** Short bio revealed when the drawer slides up */
  bio?: string;
  /** Profile link shown at the bottom of the drawer */
  href?: string;
  /** Drawer link label (defaults to "View profile") */
  linkLabel?: string;
  /** Keep the portrait in color instead of the grayscale-to-color hover */
  colored?: boolean;
  /** Link accent color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
};

export const card8Demo: Card8Props = {
  src: "https://images.unsplash.com/photo-1782754569214-aafb970bc6b1?q=80&w=2936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  name: "Deniz Arslan",
  role: "Creative Director",
  bio: "Leads brand systems for venture backed startups. Previously at North & Co.",
  href: "#",
};

/**
 * An editorial team card: the portrait sits in grayscale and gains color on
 * hover while a solid drawer slides up from the name row to reveal the bio
 * and profile link. Keyboard focus opens the drawer too.
 */
export function Card8({
  src,
  name,
  role,
  bio,
  href,
  linkLabel = "View profile",
  colored = false,
  tone = "primary",
  className,
}: Card8Props) {
  return (
    <div
      className={cn(
        "group/card8 relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl bg-muted",
        className
      )}
    >
      <img
        src={src}
        alt={name}
        className={cn(
          "absolute inset-0 size-full object-cover transition-all duration-500 ease-out motion-safe:group-hover/card8:scale-105",
          !colored &&
            "grayscale group-hover/card8:grayscale-0 group-focus-within/card8:grayscale-0"
        )}
      />

      {/* Drawer: only the name row peeks out until hover or focus slides it up */}
      <div className="absolute inset-x-0 bottom-0 translate-y-[calc(100%-4.75rem)] rounded-t-xl border-t bg-background p-5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/card8:translate-y-0 group-focus-within/card8:translate-y-0 motion-reduce:transition-none">
        <div className="flex h-[2.75rem] flex-col justify-center">
          <p className="truncate text-base font-semibold leading-tight text-foreground">{name}</p>
          <p className="truncate text-sm text-muted-foreground">{role}</p>
        </div>
        {bio && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{bio}</p>}
        {href && (
          <a
            href={href}
            className={cn(
              "mt-3 inline-flex items-center gap-1 rounded-sm text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              toneStyles[tone]
            )}
          >
            {linkLabel}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
