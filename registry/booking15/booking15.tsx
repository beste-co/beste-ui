"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  CalendarPlus,
  Check,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Navigation,
  ShieldCheck,
  Ticket,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type DetailIconKey = "service" | "date" | "time" | "location" | "guest" | "price";

interface BookingDetail {
  key: DetailIconKey;
  label: string;
  value: string;
  subValue?: string;
}

interface Booking15Action {
  icon: LucideIcon;
  label: string;
  href?: string;
}

interface Booking15Labels {
  confirmationPrefix?: string;
  scanLabel?: string;
  emailSentTemplate?: string;
  policyLabel?: string;
}

interface Booking15Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  confirmationNumber?: string;
  details?: BookingDetail[];
  provider?: {
    name: string;
    title: string;
    avatar: string;
  };
  actions?: Booking15Action[];
  email?: string;
  policyNote?: string;
  labels?: Booking15Labels;
  className?: string;
}

const detailIcons: Record<DetailIconKey, LucideIcon> = {
  service: Ticket,
  date: CalendarDays,
  time: Clock,
  location: MapPin,
  guest: User,
  price: CreditCard,
};

// Deterministic 21×21 QR-like pattern seeded by the confirmation number.
// Generates a visually convincing QR code (with the three finder squares)
// without pulling in a real QR library. Perfect for static marketing previews.
function generateQRPattern(seed: string, size = 21): boolean[][] {
  const cells: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  const setCell = (r: number, c: number, value: boolean) => {
    const row = cells[r];
    if (row) row[c] = value;
  };

  let hash = 0x9e3779b9;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      hash = (Math.imul(hash, 1_103_515_245) + 12_345) & 0x7f_ff_ff_ff;
      setCell(r, c, (hash & 1) === 1);
    }
  }

  // Blank an 8×8 quiet zone around each finder square.
  const clearZone = (startRow: number, startCol: number) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const rr = startRow + r;
        const cc = startCol + c;
        if (rr >= 0 && rr < size && cc >= 0 && cc < size) {
          setCell(rr, cc, false);
        }
      }
    }
  };
  clearZone(0, 0);
  clearZone(0, size - 8);
  clearZone(size - 8, 0);

  // Draw the three finder squares (outer 7×7 ring + inner 3×3 block).
  const drawFinder = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const rr = startRow + r;
        const cc = startCol + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        setCell(rr, cc, isOuter || isInner);
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  return cells;
}

function formatFutureDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// NOTE: In production, pass `details` and `confirmationNumber` as static
// strings read from your booking API response. The demo factory derives a
// future date from today so the preview stays relevant at any viewing time.
function createBooking15Demo(): Booking15Props {
  return {
    badge: { label: "Confirmed", variant: "secondary" },
    heading: "You're all <strong>set</strong>",
    description: "Your booking is confirmed. Show this receipt at check-in or save it for later.",
    confirmationNumber: "BK-2026-0482",
    details: [
      {
        key: "service",
        label: "Service",
        value: "Deep Tissue Massage",
        subValue: "60 min session",
      },
      {
        key: "date",
        label: "Date",
        value: formatFutureDate(4),
      },
      {
        key: "time",
        label: "Time",
        value: "14:00 — 15:00",
      },
      {
        key: "location",
        label: "Location",
        value: "Serenity Spa",
        subValue: "42 Wellness Ave, San Francisco",
      },
      {
        key: "guest",
        label: "Guest",
        value: "Alex Morgan",
        subValue: "alex@beste.co",
      },
      {
        key: "price",
        label: "Total paid",
        value: "$120.40",
        subValue: "Visa •••• 4242",
      },
    ],
    provider: {
      name: "Dr. Emily Carter",
      title: "Licensed Massage Therapist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    actions: [
      { icon: CalendarPlus, label: "Add to calendar", href: "https://beste.co" },
      { icon: Navigation, label: "Get directions", href: "https://beste.co" },
    ],
    email: "alex@beste.co",
    policyNote:
      "Free cancellation up to 24 hours before your appointment. Late cancellations may incur a 50% charge.",
    labels: {
      confirmationPrefix: "Confirmation",
      scanLabel: "Scan at check-in",
      emailSentTemplate: "Confirmation emailed to {email}",
      policyLabel: "Cancellation policy",
    },
  };
}

export const booking15Demo: Booking15Props = createBooking15Demo();

export function Booking15({
  badge,
  heading,
  description,
  confirmationNumber,
  details = [],
  provider,
  actions = [],
  email,
  policyNote,
  labels = {},
  className,
}: Booking15Props) {
  const { confirmationPrefix, scanLabel, emailSentTemplate, policyLabel } = labels;

  const qrCells = generateQRPattern(confirmationNumber ?? "BK-DEMO");
  const qrSize = qrCells.length;
  const emailSentText = email ? emailSentTemplate?.replace("{email}", email) : undefined;

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-lg px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"} className="gap-1">
                  <ShieldCheck className="size-4" />
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2
                className="text-2xl font-semibold md:text-4xl [&>strong]:font-bold [&>strong]:text-primary"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}
            {description && (
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
            )}
          </div>
        )}

        <div className="group/booking15 overflow-hidden rounded-md border bg-card shadow-sm">
          {/* Success header */}
          <div className="flex flex-col items-center gap-3 border-b bg-emerald-500/5 px-5 py-8 text-center">
            <div className="relative flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
              <Check className="relative size-8 text-emerald-500" />
            </div>
            {confirmationNumber && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {confirmationPrefix}
                </p>
                <p className="mt-0.5 text-lg font-bold tracking-wider tabular-nums">
                  {confirmationNumber}
                </p>
              </div>
            )}
          </div>

          {/* Details grid */}
          {details.length > 0 && (
            <div className="divide-y">
              {details.map((detail, i) => {
                const Icon = detailIcons[detail.key];
                return (
                  <div key={i} className="flex items-start gap-3 px-5 py-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {detail.label}
                      </p>
                      <p className="mt-0.5 text-base font-semibold">{detail.value}</p>
                      {detail.subValue && (
                        <p className="mt-0.5 text-sm text-muted-foreground">{detail.subValue}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Provider */}
          {provider && (
            <div className="flex items-center gap-3 border-t bg-muted/30 px-5 py-4">
              <Avatar className="size-11">
                <AvatarImage src={provider.avatar} alt={provider.name} className="object-cover" />
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold">{provider.name}</p>
                <p className="text-sm text-muted-foreground">{provider.title}</p>
              </div>
            </div>
          )}

          {/* QR code */}
          <div className="flex flex-col items-center gap-3 border-t bg-background px-5 py-6">
            <div className="relative rounded-md border-2 border-dashed bg-card p-4">
              <svg
                viewBox={`0 0 ${qrSize} ${qrSize}`}
                className="h-40 w-40 text-foreground"
                aria-label="Booking QR code"
                role="img"
              >
                {qrCells.flatMap((row, r) =>
                  row.map((filled, c) =>
                    filled ? (
                      <rect
                        key={`${r}-${c}`}
                        x={c}
                        y={r}
                        width={1}
                        height={1}
                        fill="currentColor"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>
            {scanLabel && <p className="text-sm font-medium text-muted-foreground">{scanLabel}</p>}
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="grid gap-2 border-t p-4 md:grid-cols-2">
              {actions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={i}
                    variant="outline"
                    asChild={Boolean(action.href)}
                    className="cursor-pointer"
                  >
                    {action.href ? (
                      <a href={action.href}>
                        <Icon className="size-4" />
                        {action.label}
                      </a>
                    ) : (
                      <>
                        <Icon className="size-4" />
                        {action.label}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Footer notes */}
          {(emailSentText || policyNote) && (
            <div className="space-y-3 border-t bg-muted/30 px-5 py-4">
              {emailSentText && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4 shrink-0" />
                  {emailSentText}
                </p>
              )}
              {policyNote && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                  <p>
                    {policyLabel && (
                      <span className="font-medium text-foreground">{policyLabel}:</span>
                    )}{" "}
                    {policyNote}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
