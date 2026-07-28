
interface FreeCtaProps {
  heading?: string;
  description?: string;
}

/**
 * Free-block notice for block docs, paired with ProCta. No button, since
 * there is nothing to upgrade to, just a clear confirmation that the block
 * installs and runs with no license.
 */
export function FreeCta({
  heading = "Free block",
  description = "This block is free. No license or account is required: install it with the CLI and use it in unlimited projects.",
}: FreeCtaProps) {
  return (
    // Borderless and set like the page around it, the same as the callouts.
    <div className="my-8 rounded-xl bg-emerald-500/10 p-5">
      <p className="text-lg font-semibold text-foreground">{heading}</p>
      <p className="mt-2 text-lg leading-8 text-foreground/80">{description}</p>
    </div>
  );
}
