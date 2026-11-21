"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Device = "laptop" | "phone" | "tablet" | "browser";

export interface DeviceFrameProps {
  /** A laptop with a slim base, a phone, a tablet, or a bare browser window */
  device?: Device;
  /** Address shown in the browser bar */
  address?: string;
  children?: ReactNode;
  className?: string;
  /** Classes for the screen area the children fill */
  screenClassName?: string;
}

export const deviceFrameDemo: DeviceFrameProps = {
  device: "browser",
  address: "studiokiln.com",
  children: (
    <div className="flex size-full flex-col gap-6 p-5 md:gap-8 md:p-7">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold tracking-tight">Studio Kiln</span>
        <span className="hidden gap-5 text-muted-foreground sm:flex">
          <span>Shop</span>
          <span>Journal</span>
          <span>About</span>
        </span>
        <span className="rounded-full bg-foreground px-3.5 py-1.5 text-background">Cart</span>
      </div>
      <div className="grid items-center gap-6 sm:grid-cols-2">
        <div>
          <p className="text-3xl leading-tight font-medium tracking-tight text-balance md:text-4xl">Stoneware for everyday tables</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Small batches thrown and glazed by hand in our Porto studio.</p>
          <span className="mt-5 inline-flex rounded-full bg-foreground px-4 py-2 text-sm text-background">Shop the collection</span>
        </div>
        <img src="https://oud.pics/b/beste/object-bowls.webp" alt="" className="aspect-4/3 w-full rounded-xl bg-muted object-cover" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { src: "https://oud.pics/b/beste/object-totes.webp", name: "Canvas tote" },
          { src: "https://oud.pics/b/beste/object-pencils.webp", name: "Pencil set" },
          { src: "https://oud.pics/b/beste/object-bowls.webp", name: "Stoneware bowls" },
        ].map((item) => (
          <div key={item.name} className="text-sm">
            <img src={item.src} alt="" className="aspect-square w-full rounded-lg bg-muted object-cover" />
            <p className="mt-2 truncate">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};

// Layered soft shadow shared by every device
const shadow = "shadow-[0_1px_2px_rgb(0_0_0/0.06),0_8px_24px_-6px_rgb(0_0_0/0.12),0_32px_64px_-24px_rgb(0_0_0/0.22)]";

export function DeviceFrame({ device = "browser", address, children, className, screenClassName }: DeviceFrameProps) {
  const screen = cn("relative size-full overflow-hidden bg-background text-foreground", screenClassName);

  if (device === "laptop") {
    return (
      <div className={cn("w-full", className)}>
        <div className={cn("rounded-t-2xl bg-neutral-900 p-[2.2%] pb-[3%] ring-1 ring-neutral-700/60", shadow)}>
          <div className={cn("aspect-16/10 rounded-sm", screen)}>{children}</div>
        </div>
        <div aria-hidden="true" className="relative mx-[-6%] h-3 rounded-b-xl bg-linear-to-b from-neutral-300 to-neutral-400 shadow-[0_18px_30px_-12px_rgb(0_0_0/0.35)] md:h-4">
          <div className="absolute inset-x-[42%] top-0 h-1.5 rounded-b-md bg-neutral-400/80" />
        </div>
      </div>
    );
  }

  if (device === "phone") {
    return (
      <div className={cn("w-full rounded-[2.75rem] bg-neutral-900 p-2.5 ring-1 ring-neutral-700/60", shadow, className)}>
        <div className={cn("aspect-[9/19.5] rounded-[2.2rem]", screen)}>
          <div aria-hidden="true" className="absolute top-2.5 left-1/2 z-10 h-6 w-1/3 -translate-x-1/2 rounded-full bg-neutral-900" />
          {children}
        </div>
      </div>
    );
  }

  if (device === "tablet") {
    return (
      <div className={cn("w-full rounded-[2rem] bg-neutral-900 p-3 ring-1 ring-neutral-700/60", shadow, className)}>
        <div className={cn("aspect-3/4 rounded-[1.4rem]", screen)}>{children}</div>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border border-border bg-card", shadow, className)}>
      <div className="flex items-center gap-3 border-b border-border bg-muted px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        </span>
        {address && <span className="mx-auto truncate rounded-full bg-card px-4 py-1 text-sm text-muted-foreground ring-1 ring-border">{address}</span>}
        <span aria-hidden="true" className="w-12.5" />
      </div>
      <div className={screen}>{children}</div>
    </div>
  );
}
