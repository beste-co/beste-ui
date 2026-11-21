"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Socialproof36Review {
  title: string;
  /** Filled stars out of five */
  rating?: number;
  text?: string;
  author?: string;
}

interface Socialproof36Props {
  /** The average score beside the stars, e.g. "4.5" */
  score?: string;
  /** Filled stars in the header */
  stars?: number;
  /** Quiet text on the right, e.g. the review count */
  count?: string;
  reviews?: Socialproof36Review[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const socialproof36Demo: Socialproof36Props = {
  score: "4.5",
  stars: 5,
  reviews: [
    { title: "Absolutely love it!", rating: 5, text: "Exceeded my expectations, and it arrived fast.", author: "Nina S." },
    { title: "Solid quality", rating: 4, text: "Looks exactly like the photos.", author: "Chet B." },
  ],
  framed: true,
};

function Stars({ value }: { value: number }) {
  return (
    <span aria-hidden="true" className="inline-flex gap-px">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={cn("size-3 fill-current stroke-0", index < value ? "text-foreground" : "text-muted-foreground/35")} />
      ))}
    </span>
  );
}

export function Socialproof36({ score, stars = 5, count, reviews = [], framed = true, fill = false, className }: Socialproof36Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-75",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(score || count) && (
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                {score}
                <Stars value={stars} />
              </span>
              {count && <span className="text-muted-foreground">{count}</span>}
            </div>
          )}
          <div className="flex flex-col">
            {reviews.map((review, index) => (
              <div key={index} className={cn("border-t border-border py-2.5", index === reviews.length - 1 && "pb-0")}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{review.title}</span>
                  {review.rating !== undefined && <Stars value={review.rating} />}
                </div>
                {review.text && <p className="mt-1 leading-normal text-foreground/75">{review.text}</p>}
                {review.author && <p className="mt-1.5 text-muted-foreground">{review.author}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
