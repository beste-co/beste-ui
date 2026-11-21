"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

interface Media31Props {
  /** The switch label at the top of the phone */
  settingLabel?: string;
  image?: string;
  title?: string;
  detail?: string;
  className?: string;
}

export const media31Demo: Media31Props = {
  settingLabel: "Reduce motion",
  image: "https://oud.pics/b/beste/oriel-ritual.webp",
  title: "Oriel Skin Studio",
};

const STYLES = `
@keyframes media31-trail { 0%, 34% { opacity: 1 } 40%, 90% { opacity: 0 } 96%, 100% { opacity: 1 } }
@keyframes media31-ghost { 0%, 34% { transform: translateY(-8px) } 40%, 100% { transform: none } }
@keyframes media31-set { 0%, 42% { opacity: 0 } 48%, 84% { opacity: 1 } 90%, 100% { opacity: 0 } }
.media31-trail { animation: media31-trail 12s ease infinite }
.media31-ghost { animation: media31-ghost 12s cubic-bezier(.45,0,.25,1) infinite }
.media31-set { opacity: 0; animation: media31-set 12s cubic-bezier(.3,0,.2,1) infinite }
@media (prefers-reduced-motion: reduce) { .media31-trail, .media31-ghost, .media31-set { animation: none } .media31-trail { opacity: 0 } .media31-set { opacity: 1 } }
`;

export function Media31({ settingLabel, image, title, detail, className }: Media31Props) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <svg viewBox="0 0 240 210" aria-hidden="true" className="w-full max-w-72 overflow-visible">
        <defs>
          <clipPath id={`${id}-ghost`}>
            <rect x="82" y="65" width="76" height="76" rx="6" />
          </clipPath>
          <clipPath id={`${id}-set`}>
            <rect x="81" y="60" width="78" height="78" rx="7" />
          </clipPath>
          <filter id={`${id}-soft`}>
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        <ellipse cx="120" cy="205" rx="62" ry="4" className="fill-foreground/5" />
        <rect x="66.5" y="2.5" width="107" height="197" rx="19" className="fill-card stroke-border drop-shadow-md" />
        <rect x="72.5" y="8.5" width="95" height="185" rx="14" className="fill-background stroke-border" />
        <rect x="106" y="14" width="28" height="4" rx="2" className="fill-muted" />
        {settingLabel && (
          <text x="80" y="38.5" fontSize="8" className="fill-muted-foreground">
            {settingLabel}
          </text>
        )}
        <rect x="141" y="30" width="19" height="11" rx="5.5" className="fill-chart-1" />
        <circle cx="154.5" cy="35.5" r="4" className="fill-white" />
        <line x1="81" y1="49" x2="159" y2="49" className="stroke-border" />
        <rect x="104" y="185" width="32" height="3" rx="1.5" className="fill-muted-foreground/30" />

        <g className="media31-trail">
          <g className="media31-ghost">
            <rect x="81.5" y="84.5" width="77" height="77" rx="7" strokeDasharray="3 3" className="fill-none stroke-muted-foreground/25" />
            <rect x="81.5" y="74.5" width="77" height="77" rx="7" strokeDasharray="3 3" className="fill-none stroke-muted-foreground/45" />
            {image && <image href={image} x="82" y="65" width="76" height="76" opacity="0.55" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}-ghost)`} filter={`url(#${id}-soft)`} />}
          </g>
        </g>
        <g className="media31-set">{image && <image href={image} x="81" y="60" width="78" height="78" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}-set)`} />}</g>

        {title && (
          <text x="81" y="158" fontSize="10" fontWeight="500" className="fill-foreground">
            {title}
          </text>
        )}
        {detail && (
          <text x="81" y="171" fontSize="8.5" className="fill-muted-foreground">
            {detail}
          </text>
        )}
      </svg>
    </div>
  );
}
