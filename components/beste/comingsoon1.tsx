"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ComingSoon1Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  launchDate?: string;
  showCountdown?: boolean;
  className?: string;
}

export const comingsoon1Demo: ComingSoon1Props = {
  badge: { label: "Coming Soon", variant: "secondary" },
  heading: "Something amazing is on the way",
  description:
    "We're working hard to bring you something special. Stay tuned for the big reveal.",
  launchDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  showCountdown: true,
};

function useCountdown(targetDate: string | undefined): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export function ComingSoon1({
  badge,
  heading,
  description,
  launchDate,
  showCountdown = true,
  className,
}: ComingSoon1Props) {
  const timeLeft = useCountdown(launchDate);

  const countdownItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">
          {badge && (
            <div>
              <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
            </div>
          )}

          {heading && (
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance max-w-4xl">
              {heading}
            </h2>
          )}

          {description && (
            <p className="text-lg md:text-xl text-balance max-w-2xl text-muted-foreground">
              {description}
            </p>
          )}

          {/* Countdown Timer */}
          {showCountdown && launchDate && (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 my-4">
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center p-4 md:p-6 rounded-xl bg-muted min-w-[80px] md:min-w-[100px]"
                >
                  <span className="text-3xl md:text-5xl font-bold tabular-nums">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="text-xs md:text-sm uppercase tracking-wider mt-1 text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
