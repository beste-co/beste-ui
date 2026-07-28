import Link from "next/link";
import { Button12 } from "@/components/beste/component/button12";

interface ProCtaProps {
  heading?: string;
  description?: string;
  label?: string;
  href?: string;
}

/**
 * Pro-block upgrade CTA for gated block docs.
 *
 * It was the cta36 block for a while, which read as a good idea — the docs
 * showing the library — but that block sets its own type scale for a full-width
 * page section, and dropped into a docs column at reading size it came out
 * smaller than the prose around it. The registry is not ours to edit, so the
 * card is built here, at the size of the page it sits on.
 *
 * The button is the library's own seal button, the same one the landing page
 * presses its CTAs into, so the one loud element in the docs is a thing we make.
 */
export function ProCta({
  heading = "Upgrade to Pro",
  description = "Pro blocks install through the shadcn CLI with your license key and ship their full source. Docs and live previews stay open to everyone, so you can read every block's details first.",
  label = "Upgrade Now",
  href = "/pricing",
}: ProCtaProps) {
  return (
    <div className="my-8 flex flex-col gap-6 rounded-xl border bg-background p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div className="min-w-0 flex-1">
        <p className="text-xl font-semibold leading-tight tracking-tight text-foreground">
          {heading}
        </p>
        <p className="mt-2 text-base text-foreground/70">{description}</p>
      </div>
      <Button12 asChild label={label} className="shrink-0">
        <Link href={href} />
      </Button12>
    </div>
  );
}
