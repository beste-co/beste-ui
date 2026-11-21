"use client";

import {
  ArrowDown,
  ArrowUp,
  Bold,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Delete,
  Ellipsis,
  Equal,
  Italic,
  Layers2,
  Monitor,
  Palette,
  Plus,
  Underline,
  X,
} from "lucide-react";

import { AiMark } from "@/components/beste/component/ai-mark";
import { cn } from "@/lib/utils";

interface Browser42Panel {
  title?: string;
  id?: string;
  contentLabel?: string;
  headingLabel?: string;
  heading?: string;
  descriptionLabel?: string;
  description?: string;
  buttonsLabel?: string;
  addLabel?: string;
  buttons?: string[];
  mediaLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
}

interface Browser42Item {
  image?: string;
  title?: string;
  meta?: string;
}

interface Browser42Site {
  brand?: string;
  links?: string[];
  cta?: string;
  heading?: string;
  description?: string;
  buttons?: string[];
  image?: string;
  gridHeading?: string;
  gridLink?: string;
  items?: Browser42Item[];
}

interface Browser42Agent {
  image?: string;
  label?: string;
}

interface Browser42Badge {
  label?: string;
  brand?: string;
}

interface Browser42Props {
  /** Project name beside the Beste mark */
  projectName?: string;
  cmsLabel?: string;
  /** Page chip in the address field */
  page?: string;
  url?: string;
  publishLabel?: string;
  /** The section editor on the left (hidden below md) */
  panel?: Browser42Panel;
  /** The client site shown on the canvas */
  site?: Browser42Site;
  /** Floating chip at the bottom left of the canvas */
  agent?: Browser42Agent;
  /** Floating chip at the bottom right of the canvas */
  badge?: Browser42Badge;
  /** Drop the outer padding so the window meets the slot edges */
  fill?: boolean;
  className?: string;
}

export const browser42Demo: Browser42Props = {
  projectName: "Oriel Skin Studio",
  cmsLabel: "CMS",
  page: "Home Page",
  url: "https://orielstudio.pt/",
  publishLabel: "Publish",
  panel: {
    title: "Hero",
    contentLabel: "Content",
    headingLabel: "Heading",
    heading: "Skin care that takes its time",
    descriptionLabel: "Description",
    description: "Facials, brows and skin consultations in a quiet room in Príncipe Real, Lisbon.",
    buttonsLabel: "Action Buttons",
    addLabel: "Add",
    buttons: ["Book a treatment", "See treatments"],
    mediaLabel: "Media",
    cancelLabel: "Cancel",
    saveLabel: "Save & Close",
  },
  site: {
    brand: "Oriel",
    links: ["Treatments", "Shop", "Journal", "Visit"],
    cta: "Book now",
    heading: "Skin care that takes its time",
    description: "Facials, brows and skin consultations in a quiet room in Príncipe Real, Lisbon.",
    buttons: ["Book a treatment", "See treatments"],
    image: "https://oud.pics/b/beste/oriel-studio.webp",
    gridHeading: "Most booked",
    gridLink: "All treatments",
    items: [
      { image: "https://oud.pics/b/beste/oriel-facial.webp", title: "Signature facial", meta: "60 min · €85" },
      { image: "https://oud.pics/b/beste/oriel-consultation.webp", title: "Skin consultation", meta: "30 min · €40" },
      { image: "https://oud.pics/b/beste/oriel-ritual.webp", title: "Hydrating ritual", meta: "75 min · €110" },
    ],
  },
  agent: {
    image: "https://oud.pics/b/beste/bestie-jelly.webp",
    label: "Your agent",
  },
  badge: {
    label: "Made with",
    brand: "Beste",
  },
};

const fieldClasses = "rounded-lg bg-card ring-1 ring-border";

export function Browser42({
  projectName,
  cmsLabel,
  page,
  url,
  publishLabel,
  panel = {},
  site = {},
  agent = {},
  badge = {},
  fill = false,
  className,
}: Browser42Props) {
  const panelButtons = panel.buttons ?? [];
  const siteButtons = site.buttons ?? [];
  const items = site.items ?? [];

  return (
    <div className={cn("relative flex size-full items-end justify-center", !fill && "px-4 pt-4", className)}>
      <div className="w-full overflow-hidden rounded-t-2xl bg-secondary px-1.5 pt-1.5 text-foreground shadow-lg">
        {/* toolbar */}
        <div className="flex h-10 items-center gap-2 px-2 text-xs text-foreground/80">
          <span className="flex shrink-0 items-center gap-2 border-r border-border pr-2.5">
            <Equal className="size-3.5" aria-hidden="true" />
            <AiMark brand="beste" label="" className="size-3.5" />
            {projectName && <span className="max-w-32 truncate">{projectName}</span>}
          </span>
          {cmsLabel && (
            <span className="hidden shrink-0 items-center gap-1.5 border-r border-border pr-2.5 md:flex">
              <Layers2 className="size-3.5" aria-hidden="true" />
              {cmsLabel}
            </span>
          )}
          <span className="flex h-7.5 min-w-0 flex-1 items-center gap-2 rounded-lg bg-card px-2 ring-1 ring-border">
            <span className="hidden gap-1 md:flex" aria-hidden="true">
              {[Plus, ChevronLeft, ChevronRight].map((Icon, index) => (
                <span key={index} className="flex size-5 items-center justify-center rounded-full border border-border">
                  <Icon className="size-3" />
                </span>
              ))}
            </span>
            {page && <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5">{page}</span>}
            {url && <span className="hidden truncate text-muted-foreground md:inline">{url}</span>}
            {publishLabel && (
              <span className="ml-auto shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs text-primary-foreground">
                {publishLabel}
              </span>
            )}
          </span>
          <span className="hidden shrink-0 items-center gap-2.5 text-muted-foreground md:flex" aria-hidden="true">
            <Palette className="size-3.5" />
            <Monitor className="size-3.5" />
            <span className="size-5.5 rounded-full bg-gradient-to-br from-sky-300 to-violet-300" />
          </span>
        </div>

        {/* body */}
        <div className="flex h-105 gap-1.5 md:h-140">
          {/* side panel */}
          <div className="hidden w-75 shrink-0 flex-col gap-2 overflow-hidden px-0.5 py-1.5 text-xs md:flex">
            <div className="flex items-center justify-between px-1.5 pt-0.5 pb-1">
              <span className="text-sm font-semibold">
                {panel.title} {panel.id && <span className="font-normal text-muted-foreground">{panel.id}</span>}
              </span>
              <X className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </div>

            <div className="flex flex-col gap-2 rounded-xl bg-muted px-3 py-2.5">
              <div className="flex items-center justify-between font-semibold">
                {panel.contentLabel}
                <ChevronUp className="size-3.5 text-muted-foreground" aria-hidden="true" />
              </div>
              {panel.headingLabel && <div className="text-muted-foreground">{panel.headingLabel}</div>}
              <div className={cn(fieldClasses, "overflow-hidden")}>
                <div className="flex items-center gap-2.5 border-b border-border px-2 py-1.5 text-xs text-foreground/70" aria-hidden="true">
                  <b>H1</b>
                  <span>Size</span>
                  <Bold className="size-3" />
                  <Italic className="size-3" />
                  <Underline className="size-3" />
                  <Ellipsis className="size-3" />
                  <span className="flex items-center gap-0.5">
                    A<ChevronDown className="size-3" />
                  </span>
                </div>
                {panel.heading && <div className="px-2.5 py-2 text-sm leading-snug font-semibold">{panel.heading}</div>}
              </div>
              {panel.descriptionLabel && <div className="text-muted-foreground">{panel.descriptionLabel}</div>}
              {panel.description && (
                <div className={cn(fieldClasses, "px-2.5 py-2 leading-normal text-foreground/90")}>{panel.description}</div>
              )}
            </div>

            <div className="flex flex-col gap-2 rounded-xl bg-muted px-3 py-2.5">
              <div className="flex items-center justify-between font-semibold">
                {panel.buttonsLabel}
                {panel.addLabel && (
                  <span className="flex items-center gap-0.5 rounded-full bg-card px-2 py-0.5 font-medium ring-1 ring-border">
                    <Plus className="size-3" aria-hidden="true" />
                    {panel.addLabel}
                  </span>
                )}
              </div>
              {panelButtons.map((label, index) => (
                <div key={label} className={cn(fieldClasses, "flex items-center justify-between p-1.5")}>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1",
                      index === 0 ? "bg-stone-800 text-stone-50" : "border border-stone-400 text-stone-800"
                    )}
                  >
                    {label}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground" aria-hidden="true">
                    <ArrowUp className="size-3" />
                    <ArrowDown className="size-3" />
                    <Delete className="size-3" />
                  </span>
                </div>
              ))}
            </div>

            {panel.mediaLabel && (
              <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2.5 font-semibold">
                {panel.mediaLabel}
                <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
              </div>
            )}

            <div className="mt-auto flex justify-end gap-1.5 p-1.5">
              {panel.cancelLabel && <span className="px-2.5 py-1.5 text-foreground/70">{panel.cancelLabel}</span>}
              {panel.saveLabel && (
                <span className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground">{panel.saveLabel}</span>
              )}
            </div>
          </div>

          {/* canvas: the client site keeps its own warm stone look */}
          <div className="relative min-w-0 flex-1 overflow-hidden rounded-t-xl bg-stone-50 text-stone-900 ring-1 ring-border">
            <div className="flex items-center justify-between px-5 py-4 text-sm text-stone-700 md:px-7">
              {site.brand && <span className="text-base font-semibold tracking-tight">{site.brand}</span>}
              {site.links && site.links.length > 0 && (
                <span className="hidden gap-5 md:flex">
                  {site.links.map((link) => (
                    <span key={link}>{link}</span>
                  ))}
                </span>
              )}
              {site.cta && <span className="rounded-full bg-stone-800 px-3 py-1.5 text-xs text-stone-50">{site.cta}</span>}
            </div>

            <div className="mx-3.5 mt-1 flex items-center gap-7 p-4 lg:p-8">
              <div className="flex flex-1 flex-col gap-3.5">
                {site.heading && (
                  <div className="text-3xl leading-none font-medium tracking-tight lg:text-4xl">{site.heading}</div>
                )}
                {site.description && (
                  <div className="max-w-85 text-sm leading-normal text-stone-600">{site.description}</div>
                )}
                {siteButtons.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {siteButtons.map((label, index) => (
                      <span
                        key={label}
                        className={cn(
                          "rounded-full px-3.5 py-2 text-sm",
                          index === 0 ? "bg-stone-800 text-stone-50" : "border border-stone-400"
                        )}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {site.image && (
                <img
                  src={site.image}
                  alt=""
                  aria-hidden="true"
                  className="hidden h-62 min-w-0 flex-1 rounded-md object-cover lg:block"
                />
              )}
            </div>

            <div className="px-5 pt-7 md:px-7">
              <div className="mb-3.5 flex items-baseline justify-between">
                {site.gridHeading && <span className="text-base font-medium tracking-tight">{site.gridHeading}</span>}
                {site.gridLink && <span className="text-xs text-stone-500">{site.gridLink}</span>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col gap-1.5">
                    {item.image && (
                      <img src={item.image} alt="" aria-hidden="true" className="aspect-square w-full rounded-md object-cover" />
                    )}
                    <span className="flex flex-wrap justify-between gap-x-2 text-xs">
                      {item.title}
                      <span className="text-stone-500">{item.meta}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {(agent.image || agent.label) && (
              <div className="absolute bottom-3.5 left-3.5 inline-flex h-9 items-center gap-2 rounded-full bg-card pr-3.5 pl-1.5 text-xs text-card-foreground shadow-md ring-1 ring-border">
                {agent.image && <img src={agent.image} alt="" aria-hidden="true" className="size-6" />}
                {agent.label}
              </div>
            )}

            {(badge.label || badge.brand) && (
              <div className="absolute right-3.5 bottom-3.5 inline-flex h-7 items-center gap-1.5 rounded-lg bg-card px-2.5 text-xs text-card-foreground ring-1 ring-border">
                <span className="size-2.5 rounded-full bg-chart-1" aria-hidden="true" />
                {badge.label}
                {badge.brand && <b className="font-semibold">{badge.brand}</b>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
