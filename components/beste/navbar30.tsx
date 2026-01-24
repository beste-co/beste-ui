"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DropdownItem {
  title: string;
  href?: string;
  description?: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

interface Navbar30Props {
  logo?: {
    text: string;
    href?: string;
  };
  leftNavItems?: NavItem[];
  rightNavItems?: NavItem[];
  button?: {
    label: string;
    href?: string;
  };
  className?: string;
}

export const navbar30Demo: Navbar30Props = {
  logo: { text: "Acme", href: "https://beste.co" },
  leftNavItems: [
    {
      label: "Products",
      dropdown: [
        {
          title: "Analytics",
          description: "Track your metrics",
          href: "https://beste.co",
        },
        {
          title: "Automation",
          description: "Streamline workflows",
          href: "https://beste.co",
        },
        {
          title: "Insights",
          description: "Data-driven decisions",
          href: "https://beste.co",
        },
      ],
    },
    { label: "Solutions", href: "https://beste.co" },
    { label: "Pricing", href: "https://beste.co" },
  ],
  rightNavItems: [
    { label: "Resources", href: "https://beste.co" },
    { label: "Blog", href: "https://beste.co" },
    { label: "Contact", href: "https://beste.co" },
  ],
  button: { label: "Get Started", href: "https://beste.co" },
};

export function Navbar30({
  logo,
  leftNavItems = [],
  rightNavItems = [],
  button,
  className,
}: Navbar30Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const renderNavItem = (item: NavItem) => {
    const hasDropdown = item.dropdown && item.dropdown.length > 0;

    if (hasDropdown) {
      return (
        <div key={item.label} className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            onClick={() =>
              setActiveDropdown(
                activeDropdown === item.label ? null : item.label
              )
            }
          >
            {item.label}
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                activeDropdown === item.label && "rotate-180"
              )}
            />
          </Button>

          {activeDropdown === item.label && (
            <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border bg-background p-2 shadow-lg">
              {item.dropdown?.map((dropdownItem) => (
                <Link
                  key={dropdownItem.title}
                  href={dropdownItem.href ?? "#"}
                  className="block rounded-md px-3 py-2 transition-colors hover:bg-accent"
                  onClick={() => setActiveDropdown(null)}
                >
                  <p className="text-sm font-medium">{dropdownItem.title}</p>
                  {dropdownItem.description && (
                    <p className="text-xs text-muted-foreground">
                      {dropdownItem.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Button key={item.label} variant="ghost" asChild>
        <Link href={item.href ?? "#"}>{item.label}</Link>
      </Button>
    );
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {leftNavItems.map((item) => renderNavItem(item))}
          </div>

          {/* Centered Logo */}
          <div className="flex flex-1 items-center justify-center lg:flex-none">
            <Link
              href={logo?.href ?? "#"}
              className="text-2xl font-bold tracking-tight"
            >
              {logo?.text ?? "Brand"}
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {rightNavItems.map((item) => renderNavItem(item))}
            {button && (
              <Button size="sm" className="ml-4" asChild>
                <Link href={button.href ?? "#"}>{button.label}</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t lg:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {[...leftNavItems, ...rightNavItems].map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <div className="space-y-1">
                    <p className="px-3 py-2 text-sm font-medium">
                      {item.label}
                    </p>
                    <div className="ml-4 space-y-1 border-l pl-4">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.title}
                          href={dropdownItem.href ?? "#"}
                          className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {dropdownItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href ?? "#"}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            {button && (
              <div className="pt-4">
                <Button className="w-full" asChild>
                  <Link href={button.href ?? "#"}>{button.label}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
