"use client";

import { Star, ThumbsUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful?: number;
  verified?: boolean;
}

interface Ecommerce6Props {
  heading?: string;
  averageRating?: number;
  totalReviews?: number;
  reviews?: Review[];
  onLoadMore?: () => void;
  onHelpful?: (reviewId: string) => void;
  className?: string;
}

export const ecommerce6Demo: Ecommerce6Props = {
  heading: "Customer Reviews",
  averageRating: 4.8,
  totalReviews: 128,
  reviews: [
    {
      id: "rev-1",
      author: "Sarah M.",
      avatar:
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",

      rating: 5,
      date: "2 days ago",
      title: "Absolutely love it!",
      content:
        "The quality exceeded my expectations. Shipping was fast and the packaging was beautiful. Would definitely recommend to anyone looking for premium products.",
      helpful: 24,
      verified: true,
    },
    {
      id: "rev-2",
      author: "James K.",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww",

      rating: 4,
      date: "1 week ago",
      title: "Great product, minor issue",
      content:
        "Overall very happy with my purchase. The only reason for 4 stars is the delivery took a bit longer than expected. Product itself is fantastic.",
      helpful: 12,
      verified: true,
    },
    {
      id: "rev-3",
      author: "Emily R.",
      rating: 5,
      date: "2 weeks ago",
      title: "Perfect gift",
      content:
        "Bought this as a gift and it was a huge hit! Beautiful craftsmanship and attention to detail. Will be ordering more.",
      helpful: 8,
      verified: false,
    },
    {
      id: "rev-4",
      author: "Michael T.",
      rating: 4,
      date: "3 weeks ago",
      title: "Solid quality",
      content:
        "Very impressed with the build quality. Looks exactly like the photos. Would buy again.",
      helpful: 5,
      verified: false,
    },
  ],
};

export function Ecommerce6({
  heading,
  averageRating,
  totalReviews,
  reviews = [],
  onLoadMore,
  onHelpful,
  className,
}: Ecommerce6Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {heading && (
              <h2 className="text-2xl font-semibold md:text-3xl">{heading}</h2>
            )}
            {averageRating && totalReviews && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-5",
                        i < Math.floor(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="font-medium">{averageRating}</span>
                <span className="text-muted-foreground">
                  ({totalReviews} reviews)
                </span>
              </div>
            )}
          </div>
          <Button variant="outline">Write a Review</Button>
        </div>

        {/* Reviews */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted font-medium">
                      {review.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.author}</span>
                      {review.verified && (
                        <Badge variant="secondary">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "size-3",
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="mt-3 font-medium">{review.title}</h3>
              <p className="mt-2 text-muted-foreground">{review.content}</p>

              {review.helpful !== undefined && (
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 cursor-pointer text-muted-foreground hover:text-foreground p-0"
                  onClick={() => onHelpful?.(review.id)}
                >
                  <ThumbsUp className="size-4" />
                  <span>Helpful ({review.helpful})</span>
                </Button>
              )}
            </div>
          ))}
        </div>

        {onLoadMore && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={onLoadMore}>
              Load More Reviews
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
