"use client";

import { useState } from "react";
import { Bookmark02Icon } from "@hugeicons/core-free-icons";
import { IconButton } from "@/components/icon-button";
import { ICON_ACTION_CLASS } from "@/components/icon-action";
import { LoginModal } from "@/components/login-modal";
import { useAuth } from "@/lib/auth-context";
import { useFavorites } from "@/lib/favorites-context";
import {
  isRegistryComponentFavorited,
  registryComponentFavoriteKey,
  registryComponentKeysToRemove,
} from "@/lib/favorite-keys";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  blockName?: string;
  componentName?: string;
  /** Registry component (the /components section). Uses its own key namespace. */
  registryComponentName?: string;
  className?: string;
  onToggle?: (added: boolean) => void;
}

export function favoriteKey(options: { blockName?: string; componentName?: string }): string {
  if (options.componentName) return `component:${options.componentName}`;
  if (options.blockName) return options.blockName;
  throw new Error("favoriteKey requires blockName or componentName");
}

export function FavoriteButton({
  blockName,
  componentName,
  registryComponentName,
  className,
  onToggle,
}: FavoriteButtonProps) {
  const { session, refreshSession } = useAuth();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const favorited = registryComponentName
    ? isRegistryComponentFavorited(registryComponentName, favorites)
    : isFavorite(favoriteKey({ blockName, componentName }));

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!session?.user) {
      setShowLoginModal(true);
      return;
    }

    const wasAdded = !favorited;

    if (registryComponentName) {
      if (favorited) {
        // Remove the new key plus any lingering (unambiguous) legacy key.
        for (const key of registryComponentKeysToRemove(registryComponentName, favorites)) {
          await toggleFavorite(key);
        }
      } else {
        await toggleFavorite(registryComponentFavoriteKey(registryComponentName));
      }
    } else {
      await toggleFavorite(favoriteKey({ blockName, componentName }));
    }

    onToggle?.(wasAdded);
  };

  return (
    <>
      {/*
        The library's icon-only button, filled like every other round action on
        the page. The favourited state is the same bookmark solid rather than a
        second glyph: `fill-current` is reached through the button's own class,
        since the button renders the icon itself and takes no class for it.
      */}
      <IconButton
        label={favorited ? "Remove from favorites" : "Add to favorites"}
        icon={Bookmark02Icon}
        onClick={handleClick}
        className={cn(
          ICON_ACTION_CLASS,
          favorited && "text-primary [&_svg]:fill-current",
          className
        )}
      />

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onLoginSuccess={refreshSession}
      />
    </>
  );
}
