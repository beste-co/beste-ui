"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor77Permission {
  label: string;
  value: string;
  /** A lock before the label and a quiet value */
  locked?: boolean;
}

interface Editor77Detail {
  label: string;
  value: string;
  strong?: boolean;
}

interface Editor77Props {
  title?: string;
  meta?: string;
  user?: { image?: string; initials?: string; name: string; role?: string };
  permissions?: Editor77Permission[];
  /** Ruled rows under the permissions, e.g. who owns the site after handover */
  details?: Editor77Detail[];
  /** A dot line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor77Demo: Editor77Props = {
  title: "Client access",
  user: { image: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=400&h=400&auto=format&fit=crop", name: "hello@beste.co" },
  permissions: [
    { label: "Text and images", value: "Can edit" },
    { label: "Layout and design", value: "Locked", locked: true },
  ],
  details: [
    { label: "Your share", value: "20% of Pro", strong: true },
  ],
  framed: true,
};

export function Editor77({ title, meta, user, permissions = [], details = [], note, framed = true, fill = false, className }: Editor77Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-4 text-sm text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">{title}</span>
              {meta && <span className="truncate text-xs text-muted-foreground">{meta}</span>}
            </div>
          )}
          {user && (
            <div className="flex items-center gap-2.5">
              {user.image ? (
                <img src={user.image} alt="" className="size-8 shrink-0 rounded-full object-cover" />
              ) : user.initials && (
                <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-foreground/75">
                  {user.initials}
                </span>
              )}
              <div className="min-w-0">
                <div className="truncate font-medium">{user.name}</div>
                {user.role && <div className="text-xs text-muted-foreground">{user.role}</div>}
              </div>
            </div>
          )}
          {permissions.length > 0 && <div aria-hidden="true" className="h-px bg-border" />}
          {permissions.map((permission, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                {permission.locked && <Lock aria-hidden="true" className="size-3 shrink-0" />}
                {permission.label}
              </span>
              <span className={permission.locked ? "text-muted-foreground" : "text-emerald-700"}>{permission.value}</span>
            </div>
          ))}
          {details.length > 0 && <div aria-hidden="true" className="h-px bg-border" />}
          {details.map((detail, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{detail.label}</span>
              <span className={cn("text-foreground", detail.strong && "font-medium")}>{detail.value}</span>
            </div>
          ))}
          {note && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
