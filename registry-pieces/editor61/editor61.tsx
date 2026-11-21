"use client";

import { ExternalLink, Link } from "lucide-react";

import { cn } from "@/lib/utils";

interface Editor61Props {
  title?: string;
  changeLabel?: string;
  urls?: string[];
  verified?: string;
  statusTitle?: string;
  status?: string;
  publishLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  fill?: boolean;
  className?: string;
}

export const editor61Demo: Editor61Props = {
  title: "Website URLs",
  urls: ["https://oriel.beste.app", "https://orielstudio.pt"],
  verified: "Domain verified · SSL active",
  framed: true,
};

export function Editor61({
  title,
  changeLabel,
  urls = [],
  verified,
  statusTitle,
  status,
  publishLabel,
  framed = true,
  fill = false,
  className,
}: Editor61Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-72",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{title}</span>
            {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
          </div>
          {urls.map((url, i) => {
            const Icon = i === 0 ? Link : ExternalLink;
            return (
              <div key={i} className="flex min-w-0 items-center gap-2 text-muted-foreground">
                <Icon aria-hidden className="size-3 shrink-0" />
                <span className="truncate">{url}</span>
              </div>
            );
          })}
          {verified && <div className="text-emerald-700">{verified}</div>}
          {(statusTitle || status || publishLabel) && <div aria-hidden className="h-px bg-border" />}
          {(statusTitle || status) && (
            <div>
              {statusTitle && <div className="text-sm font-semibold">{statusTitle}</div>}
              {status && <div className="mt-0.5 text-muted-foreground">{status}</div>}
            </div>
          )}
          {publishLabel && (
            <div className="flex h-9 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">{publishLabel}</div>
          )}
        </div>
      </div>
    </div>
  );
}
