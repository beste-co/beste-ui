"use client";

import { cn } from "@/lib/utils";

interface Notification28Studio {
  name?: string;
  /** The studio's square image; without it a letter chip */
  image?: string;
  initial?: string;
}

interface Notification28Props {
  from?: string;
  to?: string;
  subject?: string;
  studio?: Notification28Studio;
  heading?: string;
  body?: string;
  addressLabel?: string;
  address?: string;
  footer?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const notification28Demo: Notification28Props = {
  from: "Halden Studio <hello@beste.co>",
  subject: "You have been invited to edit Oriel Skin Studio",
  studio: { name: "Halden Studio", image: "https://oud.pics/b/gradients/gradient-silk-orange.webp" },
  heading: "Hi Norah, your website is ready for you",
  body: "You can now change the text and photos on orielstudio.pt yourself.",
  address: "edit.haldenstudio.com/oriel",
  framed: true,
};

export function Notification28({
  from,
  to,
  subject,
  studio,
  heading,
  body,
  addressLabel,
  address,
  footer,
  framed = true,
  fill = false,
  className,
}: Notification28Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-100",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div
          className={cn(
            "flex flex-col overflow-hidden rounded-2xl bg-card text-xs text-card-foreground",
            !framed && "shadow-lg"
          )}
        >
          {(from || to || subject) && (
          <div className="flex flex-col gap-1.5 border-b border-border px-4 py-3.5 text-muted-foreground">
            {from && (
              <div className="truncate">
                <span className="text-muted-foreground/70">From</span>&nbsp; {from}
              </div>
            )}
            {to && (
              <div className="truncate">
                <span className="text-muted-foreground/70">To</span>&nbsp; {to}
              </div>
            )}
            {subject && <div className="mt-0.5 text-sm font-semibold text-foreground">{subject}</div>}
          </div>
          )}

          <div className="flex flex-1 flex-col gap-3.5 bg-background px-6 pt-6 pb-5">
            {studio && (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                {studio.image ? (
                  <img src={studio.image} alt="" className="size-6 shrink-0 rounded-md object-cover" />
                ) : studio.initial && (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-emerald-900 text-emerald-50">
                    {studio.initial}
                  </span>
                )}
                <span className="truncate">{studio.name}</span>
              </div>
            )}
            {heading && <div className="text-lg leading-tight font-medium tracking-tight">{heading}</div>}
            {body && <p className="leading-relaxed text-muted-foreground">{body}</p>}
            {address && (
              <div className="flex flex-col gap-0.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                {addressLabel && <span className="text-muted-foreground">{addressLabel}</span>}
                <span className="truncate font-medium text-emerald-900">{address}</span>
              </div>
            )}
            {footer && (
              <>
                <div aria-hidden className="h-px bg-border" />
                <div className="truncate text-muted-foreground">{footer}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
