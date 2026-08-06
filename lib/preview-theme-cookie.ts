/**
 * Name of the cookie mirroring the visitor's preview theme, so an embed can be
 * server-rendered in it instead of flashing the default first.
 *
 * It lives in its own module with no `"use client"` so the embed Server
 * Components can import it: they used to keep hand-copied literals, which is
 * fine until the name changes on one side only and the server silently reads a
 * cookie nobody writes any more.
 *
 * Versioned in step with `STORAGE_KEY` in `preview-theme-store` — bump both when
 * a new default theme should override picks people have already made.
 */
export const THEME_NAME_COOKIE = "blocks-preview-theme-name-v2";
