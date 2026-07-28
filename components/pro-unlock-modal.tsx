"use client";

import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { BesteLogo } from "@/components/icons/beste-logo";
import { Button12 } from "@/components/beste/component/button12";
import { IconButton } from "@/components/icon-button";
import { ICON_ACTION_CLASS_SM } from "@/components/icon-action";

interface ProUnlockContentProps {
  onGetProAccess?: () => void;
}

const FEATURES = [
  "All Pro blocks & new ones added daily",
  "Clean, typed React + Tailwind code",
  "Fully responsive & accessible",
  "shadcn/ui compatible",
  "CLI access for quick installation",
];

/**
 * The upgrade pitch, shared by the modal, the account page and the gate over a
 * Pro block's source.
 *
 * It draws no surface of its own on purpose: it is dropped into three different
 * containers, and a filled panel inside the account page's filled panel would
 * flatten both. The list is separated by space rather than rules for the same
 * reason — it has to look deliberate on whatever it lands on.
 */
export function ProUnlockContent({ onGetProAccess }: ProUnlockContentProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#FF7322]/10">
          <BesteLogo width={24} height={24} color="#FF7322" />
        </span>
        <div>
          <h3 className="text-2xl font-semibold leading-tight tracking-tight">Upgrade to Pro</h3>
          <p className="mt-2 text-base text-foreground/70">
            Get instant access to production-ready code you can copy, customize, and ship.
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-base text-foreground/80">
            <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} className="shrink-0 text-[#FF7322]" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-3">
        {/* The library's own button, as everywhere else it asks for something. */}
        <Button12
          label="Get Pro access"
          onClick={onGetProAccess}
          className="w-full justify-between"
        />
        <p className="text-sm text-foreground/50">One-time purchase · Lifetime access</p>
      </div>
    </div>
  );
}

interface ProUnlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGetProAccess?: () => void;
}

// Modal wrapper with close button
export function ProUnlockModal({ open, onOpenChange, onGetProAccess }: ProUnlockModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl p-8 sm:max-w-md" showCloseButton={false}>
        {/* `button4` on the outside, the close on the inside: Radix would hand a
            ref and a handler to a component that takes neither, and a button
            inside a button is not markup a parser keeps. */}
        <span className="absolute top-4 right-4 z-10">
          <IconButton asChild label="Close" icon={Cancel01Icon} className={ICON_ACTION_CLASS_SM}>
            <DialogClose />
          </IconButton>
        </span>
        <DialogHeader className="sr-only">
          <DialogTitle>Unlock Pro</DialogTitle>
          <DialogDescription>Get access to pro components</DialogDescription>
        </DialogHeader>
        <ProUnlockContent onGetProAccess={onGetProAccess} />
      </DialogContent>
    </Dialog>
  );
}
