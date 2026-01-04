"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Milestone {
  label: string;
  completed: boolean;
}

interface ComingSoon2Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  showProgress?: boolean;
  progressLabel?: string;
  milestones?: Milestone[];
  className?: string;
}

export const comingsoon2Demo: ComingSoon2Props = {
  badge: { label: "In Development", variant: "secondary" },
  heading: "Building something great",
  description:
    "We're making steady progress on our new platform. Here's where we are in our development journey.",
  showProgress: true,
  progressLabel: "Development Progress",
  milestones: [
    { label: "Design", completed: true },
    { label: "Backend", completed: true },
    { label: "Frontend", completed: true },
    { label: "Testing", completed: false },
    { label: "Launch", completed: false },
  ],
};

export function ComingSoon2({
  badge,
  heading,
  description,
  showProgress = true,
  progressLabel,
  milestones = [],
  className,
}: ComingSoon2Props) {
  // Calculate progress based on completed milestones
  const completedCount = milestones.filter((m) => m.completed).length;
  const progress =
    milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

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

          {showProgress && (
            <div className="w-full max-w-2xl my-6">
              {progressLabel && (
                <div className="text-sm font-medium mb-3 text-muted-foreground">
                  {progressLabel}
                </div>
              )}

              <Progress value={progress} className="h-3" />

              <div className="text-sm mt-2 text-muted-foreground text-right">
                {Math.round(progress)}% complete
              </div>

              {milestones.length > 0 && (
                <div className="flex justify-between mt-6 relative">
                  <div className="absolute top-3 left-0 right-0 h-0.5 bg-muted" />
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.label}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                          milestone.completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted border-2 border-border"
                        )}
                      >
                        {milestone.completed && "✓"}
                      </div>
                      <span className="text-xs mt-2 text-muted-foreground">
                        {milestone.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
