"use client";

import { BadgeCheck, Check, Heart, MapPin, Plus, Star } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TalentCardProps {
  name: string;
  avatar?: string;
  verified?: boolean;
  /** Average rating; omit to show the "New" label instead */
  rating?: number;
  reviews?: number;
  location: string;
  distance: string;
  rate: string;
  /** Muted availability line under the actions */
  availability?: string;
  defaultWishlisted?: boolean;
  defaultInvited?: boolean;
  onWishlist?: (next: boolean) => void;
  onInvite?: (next: boolean) => void;
  className?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const talentCardDemo: TalentCardProps = {
  name: "Selin Aydar",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop",
  verified: true,
  rating: 4.6,
  reviews: 18,
  location: "Porto, PT",
  distance: "820 miles away",
  rate: "$142",
  availability: "Recently active — Available",
};

export function TalentCard({
  name,
  avatar,
  verified = false,
  rating,
  reviews,
  location,
  distance,
  rate,
  availability,
  defaultWishlisted = false,
  defaultInvited = false,
  onWishlist,
  onInvite,
  className,
}: TalentCardProps) {
  const [wishlisted, setWishlisted] = useState(defaultWishlisted);
  const [invited, setInvited] = useState(defaultInvited);

  const toggleWishlist = () => {
    const next = !wishlisted;
    setWishlisted(next);
    onWishlist?.(next);
  };

  const toggleInvite = () => {
    const next = !invited;
    setInvited(next);
    onInvite?.(next);
  };

  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar className="size-11">
          {avatar && <AvatarImage src={avatar} alt={name} />}
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold text-foreground">{name}</p>
            {verified && (
              <BadgeCheck className="size-4 shrink-0 text-primary" />
            )}
          </div>
          {rating != null ? (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
              {reviews != null && <span>({reviews} reviews)</span>}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">New to the network</p>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-lg border">
        <div className="border-r p-3">
          <p className="flex items-center gap-1 truncate text-sm font-medium text-foreground">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
            {location}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{distance}</p>
        </div>
        <div className="p-3">
          <p className="text-sm font-medium text-foreground">{rate}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">avg. daily rate</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={toggleWishlist}
          aria-pressed={wishlisted}
          className="cursor-pointer gap-2"
        >
          <Heart
            className={cn(
              "size-4",
              wishlisted && "fill-rose-500 text-rose-500"
            )}
          />
          {wishlisted ? "Saved" : "Wishlist"}
        </Button>
        <Button
          variant={invited ? "secondary" : "default"}
          onClick={toggleInvite}
          aria-pressed={invited}
          className="cursor-pointer gap-2"
        >
          {invited ? <Check className="size-4" /> : <Plus className="size-4" />}
          {invited ? "Invited" : "Invite"}
        </Button>
      </div>

      {availability && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {availability}
        </p>
      )}
    </div>
  );
}
