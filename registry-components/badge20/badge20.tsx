import { cn } from "@/lib/utils";

type Tone = "muted" | "foreground";

interface Badge20Logo {
  src: string;
  alt: string;
}

interface Badge20Props {
  /** Muted intro text before the logos (e.g. "Trusted by") */
  label?: string;
  /** The logos */
  logos: Badge20Logo[];
  /** Logo height in pixels */
  height?: number;
  /** Render logos grayscale at reduced opacity (color on hover) */
  grayscale?: boolean;
  /** Label color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  muted: "text-muted-foreground",
  foreground: "text-foreground",
};

export const badge20Demo: Badge20Props = {
  label: "Powering teams at",
  logos: [
    { src: "https://oud.pics/sm/l/npm.svg", alt: "npm" },
    { src: "https://oud.pics/sm/l/pnpm.svg", alt: "pnpm" },
    { src: "https://oud.pics/sm/l/yarn.svg", alt: "Yarn" },
    { src: "https://oud.pics/sm/l/bun.svg", alt: "Bun" },
  ],
};

/**
 * A compact "trusted by" strip: muted intro text and a row of logos,
 * grayscale by default with full color on hover.
 */
export function Badge20({
  label,
  logos,
  height = 24,
  grayscale = true,
  tone = "muted",
  className,
}: Badge20Props) {
  if (logos.length === 0) return null;

  return (
    <span className={cn("inline-flex w-fit flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {label && (
        <span className={cn("text-sm font-medium", toneStyles[tone])}>{label}</span>
      )}
      {logos.map((logo) => (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary external logo sources (often SVG) don't go through next/image
        <img
          key={logo.src}
          src={logo.src}
          alt={logo.alt}
          style={{ height }}
          className={cn(
            "w-auto object-contain",
            grayscale && "opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
          )}
        />
      ))}
    </span>
  );
}
