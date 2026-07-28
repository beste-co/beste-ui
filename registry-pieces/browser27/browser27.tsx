"use client";

import { Camera, Lock, MapPin, Mic, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  className?: string;
}

const ICONS: Record<PermissionIcon, LucideIcon> = {
  camera: Camera,
  location: MapPin,
  mic: Mic,
  lock: Lock,
};

export const browser27Demo: Browser27Props = {
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
  className,
}: Browser27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Lock className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {domain}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              {connectionLabel}
            </span>
          </div>
        </div>
        {permissions.length > 0 && (
          <div className="flex flex-col gap-1 border-t border-border pt-2 text-xs">
            {permissions.map((p, idx) => {
              const Icon = ICONS[p.icon ?? "lock"];
              const granted = p.granted ?? false;
              return (
                <div
                  key={`${p.label}-${idx}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 text-card-foreground">
                    <Icon
                      className="size-3.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>{p.label}</span>
                  </div>
                  <span
                    className={cn(
                      "font-semibold",
                      granted
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
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
