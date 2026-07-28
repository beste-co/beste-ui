import { cn } from "@/lib/utils";

type Tone = "muted" | "outline";

interface Badge19Props {
  /** The tag labels */
  tags: string[];
  /** Chip style: muted fill (default) or bordered outline */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted text-foreground",
  outline: "border bg-background text-foreground",
};

export const badge19Demo: Badge19Props = {
  tags: ["Branding", "Web design", "Motion", "3D"],
};

/** A wrapping group of small tag chips, services, skills, post topics. */
export function Badge19({ tags, tone = "muted", className }: Badge19Props) {
  if (tags.length === 0) return null;

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn("rounded-full px-2.5 py-1 text-sm font-medium", toneStyles[tone])}
        >
          {tag}
        </span>
      ))}
    </span>
  );
}
