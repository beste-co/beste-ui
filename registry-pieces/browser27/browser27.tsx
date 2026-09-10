"use client";

import { Camera, Lock, MapPin, Mic, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type PermissionIcon = "camera" | "location" | "mic" | "lock";

interface Permission {
  icon?: PermissionIcon;
  label: string;
  granted?: boolean;
  grantedLabel?: string;
  deniedLabel?: string;
}

interface Browser27Props {
  domain?: string;
  connectionLabel?: string;
  permissions?: Permission[];
  defaultGrantedLabel?: string;
  defaultDeniedLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const ICONS: Record<PermissionIcon, LucideIcon> = {
  camera: Camera,
  location: MapPin,
  mic: Mic,
  lock: Lock,
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const browser27Demo: Browser27Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  domain: "stripe.com",
  connectionLabel: "Connection is secure",
  permissions: [
    { icon: "camera", label: "Camera", granted: true },
    { icon: "location", label: "Location", granted: false },
  ],
  defaultGrantedLabel: "Allowed",
  defaultDeniedLabel: "Ask",
};

export function Browser27({
  domain = "example.com",
  connectionLabel = "Connection is secure",
  permissions = [],
  defaultGrantedLabel = "Allowed",
  defaultDeniedLabel = "Ask",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Browser27Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-72 flex-col gap-2 rounded-lg p-3 shadow-md",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Lock className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold">
              {domain}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              {connectionLabel}
            </span>
          </div>
        </div>
        {permissions.length > 0 && (
          <div className="flex flex-col gap-1 border-t border-current/15 pt-2 text-xs">
            {permissions.map((p, idx) => {
              const Icon = ICONS[p.icon ?? "lock"];
              const granted = p.granted ?? false;
              return (
                <div
                  key={`${p.label}-${idx}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className="size-3.5 text-current/60"
                      aria-hidden="true"
                    />
                    <span>{p.label}</span>
                  </div>
                  <span
                    className={cn(
                      "font-semibold",
                      granted
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-current/60"
                    )}
                  >
                    {granted
                      ? p.grantedLabel ?? defaultGrantedLabel
                      : p.deniedLabel ?? defaultDeniedLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
