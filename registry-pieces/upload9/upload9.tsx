"use client";

import { ChevronRight, Cloud, Figma, FolderOpen, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

interface Source {
  id: string;
  name: string;
  description: string;
  icon: "drive" | "dropbox" | "figma" | "device";
  src?: string;
  alt?: string;
  connected?: boolean;
  fileCount?: string;
}

interface Upload9Props {
  sources?: Source[];
  className?: string;
}

const iconMap = {
  drive: FolderOpen,
  dropbox: Cloud,
  figma: Figma,
  device: HardDrive,
};

export const upload9Demo: Upload9Props = {
  sources: [
    {
      id: "drive",
      name: "Google Drive",
      description: "mira@beste.co",
      icon: "drive",
      src: "https://oud.pics/sm/l/google-drive.avif",
      alt: "Google Drive",
      connected: true,
      fileCount: "1,248 files",
    },
    {
      id: "figma",
      name: "Figma",
      description: "Beste Studio team",
      icon: "figma",
      src: "https://oud.pics/sm/l/figma.png",
      alt: "Figma",
      connected: true,
      fileCount: "86 files",
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Connect to browse",
      icon: "dropbox",
      src: "https://oud.pics/sm/l/dropbox.png",
      alt: "Dropbox",
    },
    {
      id: "device",
      name: "This device",
      description: "macOS · 248 GB free",
      icon: "device",
      src: "https://oud.pics/sm/l/apple.png",
      alt: "This device",
      connected: true,
    },
  ],
};

export function Upload9({
  sources = [],
  className,
}: Upload9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-xl border border-border bg-card p-2 shadow-sm">
        <span className="px-2 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Import from
        </span>
        {sources.map((s) => {
          const Icon = iconMap[s.icon];
          return (
            <button
              key={s.id}
              type="button"
              className="flex items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted"
            >
              <div
                className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground"
                aria-hidden="true"
              >
                {s.src ? (
                  <img
                    src={s.src}
                    alt={s.alt ?? s.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <Icon className="size-4" aria-hidden="true" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-card-foreground">
                  {s.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {s.description}
                </span>
              </div>
              {s.connected ? (
                <>
                  {s.fileCount && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {s.fileCount}
                    </span>
                  )}
                  <ChevronRight
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <span className="shrink-0 rounded-md border border-border bg-background px-2 py-0.5 text-xs font-semibold text-card-foreground">
                  Connect
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
