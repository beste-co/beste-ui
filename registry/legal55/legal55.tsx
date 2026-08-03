"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Badge {
  label: string;
}

interface ActionLink {
  label: string;
  href: string;
}

interface ClausePair {
  reference: string;
  clause: string;
  plain: string;
}

interface Legal55Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  columnLabels?: { clause: string; plain: string };
  pairs?: ClausePair[];
  disclaimer?: string;
  button?: ActionLink;
  className?: string;
}

export const legal55Demo: Legal55Props = {
  badge: { label: "Terms, translated" },
  heading: "The contract on the left, what we actually mean on the right",
  description:
    "The wording on the left is the binding text. The wording on the right is not, but it is what we would say if you asked us on a call.",
  columnLabels: { clause: "The clause", plain: "In plain words" },
  pairs: [
    {
      reference: "4.1",
      clause:
        "Customer retains all right, title and interest in Customer Data. Provider is granted a limited licence to process Customer Data solely to deliver the Services.",
      plain:
        "Your records stay yours. We only touch them to run the product, never to train anything or sell anything.",
    },
    {
      reference: "6.3",
      clause:
        "Either party may terminate this Agreement for convenience on thirty (30) days' written notice, without penalty or early termination charge.",
      plain: "You can leave with a month's notice, and it costs nothing to go.",
    },
    {
      reference: "6.5",
      clause:
        "Upon termination, Provider shall make Customer Data available for export in a machine-readable format for a period of ninety (90) days.",
      plain:
        "For three months after you leave you can still pull everything out, in a format another system can read.",
    },
    {
      reference: "9.2",
      clause:
        "Provider shall notify Customer without undue delay, and in any event within seventy-two (72) hours, of becoming aware of a Personal Data Breach.",
      plain:
        "If something goes wrong with your data you hear it from us within three days, even when it is embarrassing.",
    },
    {
      reference: "11.4",
      clause:
        "Provider shall give not less than thirty (30) days' notice of any change to the list of Subprocessors, during which Customer may object.",
      plain:
        "We tell you a month before anyone new gets involved, and you get to say no.",
    },
  ],
  disclaimer:
    "Where the two columns disagree, the clause wins. The plain wording is a reading aid, not a contract.",
  button: { label: "Read the full agreement", href: "https://beste.co" },
};

export function Legal55({
  badge,
  heading,
  description,
  columnLabels,
  pairs = [],
  disclaimer,
  button,
  className,
}: Legal55Props) {
  return (
    <section className={cn("bg-background py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {badge && <Badge23 label={badge.label} />}

        <div className="mt-6 border-t border-border pt-8 md:pt-10">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            {heading && (
              <h2 className="text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <div className="flex md:justify-end">
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        {columnLabels && (
          <div className="mt-12 hidden gap-12 border-b border-border pb-3 md:mt-16 md:grid md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)]">
            <span aria-hidden="true" />
            <span className="text-sm text-muted-foreground">
              {columnLabels.clause}
            </span>
            <span className="text-sm text-muted-foreground">
              {columnLabels.plain}
            </span>
          </div>
        )}

        <div className="mt-12 md:mt-0">
          {pairs.map((pair, index) => (
            <div
              key={index}
              className="grid gap-4 border-b border-border py-8 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-12"
            >
              <span className="text-sm text-muted-foreground">
                {pair.reference}
              </span>
              <p className="text-base leading-relaxed text-muted-foreground">{pair.clause}</p>
              <p className="text-base leading-relaxed text-foreground">{pair.plain}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          {disclaimer && (
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{disclaimer}</p>
          )}
          {button && (
            <Button21 asChild label={button.label} tone="outline">
              <Link href={button.href} />
            </Button21>
          )}
        </div>
      </div>
    </section>
  );
}
