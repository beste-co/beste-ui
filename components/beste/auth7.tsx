"use client";

import { ChevronRight, UserPlus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface Account {
  name: string;
  email: string;
  avatar?: {
    src: string;
    alt: string;
  };
  href?: string;
}

interface Auth7Props {
  heading?: string;
  description?: string;
  accounts?: Account[];
  useAnotherAccount?: {
    label: string;
    href: string;
  };
  labels?: {
    legal?: string;
  };
  className?: string;
}

export const auth7Demo: Auth7Props = {
  heading: "Choose an account",
  description: "to continue to Beste",
  accounts: [
    {
      name: "Jane Cooper",
      email: "jane@example.com",
      avatar: {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        alt: "Jane Cooper",
      },
      href: "https://beste.co",
    },
    {
      name: "Marcus Lee",
      email: "marcus@workmail.com",
      avatar: {
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        alt: "Marcus Lee",
      },
      href: "https://beste.co",
    },
    {
      name: "Priya Sharma",
      email: "priya@studio.io",
      avatar: {
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        alt: "Priya Sharma",
      },
      href: "https://beste.co",
    },
  ],
  useAnotherAccount: {
    label: "Use another account",
    href: "https://beste.co",
  },
  labels: {
    legal:
      'By continuing, you agree to our <a href="https://beste.co">Terms</a> and <a href="https://beste.co">Privacy Policy</a>.',
  },
};

export function Auth7({
  heading,
  description,
  accounts = [],
  useAnotherAccount,
  labels = {},
  className,
}: Auth7Props) {
  const { legal: legalText } = labels;

  return (
    <section
      className={cn("flex min-h-screen items-center justify-center px-4 py-16 md:py-24 w-full", className)}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          {heading && <h1 className="text-2xl font-bold md:text-3xl">{heading}</h1>}
          {description && <p className="mt-2 text-base text-muted-foreground">{description}</p>}
        </div>

        <div className="overflow-hidden rounded-md border bg-card">
          <ul className="divide-y">
            {accounts.map((account, index) => (
              <li key={index}>
                <Link
                  href={account.href ?? "#"}
                  className="group/auth7 flex items-center gap-4 p-4 transition-colors hover:bg-muted"
                >
                  <Avatar className="size-11">
                    {account.avatar && (
                      <AvatarImage
                        src={account.avatar.src}
                        alt={account.avatar.alt}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback>
                      {account.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{account.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{account.email}</p>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover/auth7:translate-x-0.5" />
                </Link>
              </li>
            ))}

            {useAnotherAccount && (
              <li>
                <Link
                  href={useAnotherAccount.href}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-muted"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <UserPlus className="size-5" />
                  </span>
                  <span className="flex-1 font-medium">{useAnotherAccount.label}</span>
                </Link>
              </li>
            )}
          </ul>
        </div>

        {legalText && (
          <FieldDescription
            className="!mt-6 px-6 text-center"
            dangerouslySetInnerHTML={{ __html: legalText }}
          />
        )}
      </div>
    </section>
  );
}
