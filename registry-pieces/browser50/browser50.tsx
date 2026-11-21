"use client";

import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

type Layout = "desktop" | "mobile";

interface Browser50MenuItem {
  name?: string;
  note?: string;
  price?: string;
  image?: string;
}

interface Browser50Props {
  /** The custom domain in the address bar */
  url?: string;
  /** A small status beside the address, e.g. "Published" */
  status?: string;
  brand?: string;
  nav?: string[];
  heading?: string;
  description?: string;
  button?: string;
  image?: string;
  menuTitle?: string;
  menu?: Browser50MenuItem[];
  hoursTitle?: string;
  hours?: { day?: string; time?: string }[];
  /** The page laid out for a wide screen or a phone */
  layout?: Layout;
  /** Show the address bar; turn off inside a device frame that has its own */
  chrome?: boolean;
  /** Let the page scroll slowly from top to bottom and back */
  scroll?: boolean;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width and height instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const browser50Demo: Browser50Props = {
  url: "pratabakery.com",
  status: "Published",
  brand: "Prata",
  nav: ["Menu", "Visit", "Order"],
  heading: "Bread from the wood oven, every morning",
  description: "Sourdough, pastries and coffee on Rua da Prata since 2014.",
  button: "See the menu",
  image: "https://oud.pics/b/beste/object-biscuits.webp",
  menuTitle: "Baked today",
  menu: [
    { name: "Country sourdough", note: "48 hour rise", price: "€6", image: "https://oud.pics/b/beste/object-bowls.webp" },
    { name: "Almond croissant", note: "Twice baked", price: "€3.5", image: "https://oud.pics/b/beste/object-biscuits.webp" },
    { name: "Rye loaf", note: "Seeded crust", price: "€5", image: "https://oud.pics/b/beste/object-bag.webp" },
  ],
  hoursTitle: "Opening hours",
  hours: [
    { day: "Monday to Friday", time: "7:00 to 18:00" },
    { day: "Saturday", time: "8:00 to 16:00" },
    { day: "Sunday", time: "Closed" },
  ],
  layout: "desktop",
  chrome: true,
  scroll: true,
  framed: true,
};

const STYLES = `
@keyframes browser50-scroll { 0%, 14% { transform: translateY(0) } 46%, 60% { transform: translateY(var(--browser50-travel)) } 92%, 100% { transform: translateY(0) } }
.browser50-page { animation: browser50-scroll 16s cubic-bezier(.65,0,.35,1) infinite }
@media (prefers-reduced-motion: reduce) { .browser50-page { animation: none } }
`;

export function Browser50({
  url,
  status,
  brand,
  nav = [],
  heading,
  description,
  button,
  image,
  menuTitle,
  menu = [],
  hoursTitle,
  hours = [],
  layout = "desktop",
  chrome = true,
  scroll = true,
  framed = true,
  fill = false,
  className,
}: Browser50Props) {
  const mobile = layout === "mobile";
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          fill ? "h-full" : mobile ? "max-w-60" : "max-w-xl",
          framed && !fill && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "flex flex-col overflow-hidden bg-card text-card-foreground",
            fill ? "size-full" : cn("rounded-2xl", mobile ? "h-112" : "h-88"),
            !framed && !fill && "shadow-lg"
          )}
        >
          {chrome && url && (
            <div className="flex shrink-0 items-center gap-2 border-b border-border bg-muted px-3.5 py-2.5 text-xs">
              <Lock className="size-3 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{url}</span>
              {status && (
                <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {status}
                </span>
              )}
            </div>
          )}
          <div className="relative min-h-0 flex-1 overflow-hidden" style={{ ["--browser50-travel" as string]: mobile ? "-58%" : "-46%" }}>
            <div className={cn(scroll && "browser50-page")}>
              <div className={cn("flex items-center justify-between", mobile ? "px-4 py-3" : "px-6 py-4")}>
                <span className="text-sm font-semibold tracking-tight">{brand}</span>
                {mobile ? (
                  <span className="flex flex-col gap-1">
                    <span className="h-px w-4 bg-foreground" />
                    <span className="h-px w-4 bg-foreground" />
                  </span>
                ) : (
                  <span className="flex gap-4 text-xs text-muted-foreground">
                    {nav.map((item, index) => (
                      <span key={index}>{item}</span>
                    ))}
                  </span>
                )}
              </div>
              <div className={cn("grid items-center gap-4", mobile ? "px-4 pt-2 pb-5" : "grid-cols-2 px-6 pt-3 pb-7")}>
                <div>
                  <p className={cn("leading-tight font-medium tracking-tight text-balance", mobile ? "text-xl" : "text-2xl")}>{heading}</p>
                  {description && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>}
                  {button && <span className="mt-3.5 inline-flex rounded-full bg-primary px-3.5 py-1.5 text-xs text-primary-foreground">{button}</span>}
                </div>
                {image && <img src={image} alt="" className={cn("w-full rounded-xl bg-muted object-cover", mobile ? "aspect-4/3" : "aspect-square")} />}
              </div>
              {menu.length > 0 && (
                <div className={cn("border-t border-border", mobile ? "px-4 py-5" : "px-6 py-6")}>
                  {menuTitle && <p className="mb-3 text-sm font-medium">{menuTitle}</p>}
                  <div className={cn("grid gap-2.5", mobile ? "grid-cols-1" : "grid-cols-3")}>
                    {menu.map((item, index) => (
                      <div key={index} className={cn("rounded-xl bg-muted p-2", mobile && "flex items-center gap-3")}>
                        {item.image && <img src={item.image} alt="" className={cn("rounded-lg bg-card object-cover", mobile ? "size-12" : "aspect-4/3 w-full")} />}
                        <div className={cn("flex min-w-0 flex-1 items-end justify-between gap-2", !mobile && "mt-2 px-0.5")}>
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-medium">{item.name}</span>
                            {item.note && <span className="block truncate text-xs text-muted-foreground">{item.note}</span>}
                          </span>
                          {item.price && <span className="shrink-0 text-xs">{item.price}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {hours.length > 0 && (
                <div className={cn("border-t border-border", mobile ? "px-4 py-5" : "px-6 py-6")}>
                  {hoursTitle && <p className="mb-2 text-sm font-medium">{hoursTitle}</p>}
                  {hours.map((row, index) => (
                    <div key={index} className="flex justify-between gap-3 border-b border-border py-2 text-xs last:border-b-0">
                      <span>{row.day}</span>
                      <span className="text-muted-foreground">{row.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
