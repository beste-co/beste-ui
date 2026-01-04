"use client";

import { Bot, Check, ChevronDown, LineChart, Plug, Shield } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UseCaseFeature {
  id: string;
  text: string;
}

interface UseCaseItem {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  features?: UseCaseFeature[];
}

interface UseCase7Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  items: UseCaseItem[];
  className?: string;
}

export const usecase7Demo: UseCase7Props = {
  badge: { label: "Solutions", variant: "secondary" },
  heading: "Explore Our Solutions",
  description:
    "Click on each solution to learn more about how we can help your business grow.",
  items: [
    {
      id: "automation",
      icon: <Bot className="size-5" />,
      title: "Process Automation",
      description:
        "Automate repetitive tasks and workflows to save time and reduce errors. Our intelligent automation engine learns from your processes and suggests optimizations.",
      image: {
        src: "https://images.unsplash.com/photo-1556644424-2379c2803793?q=80&w=2938&auto=format&fit=crop",
        alt: "Automation",
      },
      features: [
        { id: "a1", text: "Visual workflow builder" },
        { id: "a2", text: "AI-powered suggestions" },
        { id: "a3", text: "Scheduled triggers" },
      ],
    },
    {
      id: "analytics",
      icon: <LineChart className="size-5" />,
      title: "Advanced Analytics",
      description:
        "Gain deep insights into your data with real-time dashboards, custom reports, and predictive analytics powered by machine learning.",
      image: {
        src: "https://images.unsplash.com/photo-1601976323740-71540cb51569?q=80&w=2938&auto=format&fit=crop",
        alt: "Analytics",
      },
      features: [
        { id: "b1", text: "Real-time dashboards" },
        { id: "b2", text: "Custom reports" },
        { id: "b3", text: "Predictive insights" },
      ],
    },
    {
      id: "integration",
      icon: <Plug className="size-5" />,
      title: "Seamless Integrations",
      description:
        "Connect with 200+ apps and services. Our pre-built connectors and flexible API make integration effortless.",
      image: {
        src: "https://images.unsplash.com/photo-1742412615444-8d8d8c66f94f?q=80&w=2962&auto=format&fit=crop",
        alt: "Integrations",
      },
      features: [
        { id: "c1", text: "200+ pre-built connectors" },
        { id: "c2", text: "RESTful API" },
        { id: "c3", text: "Webhooks support" },
      ],
    },
    {
      id: "security",
      icon: <Shield className="size-5" />,
      title: "Enterprise Security",
      description:
        "Bank-grade security with end-to-end encryption, SSO, and compliance certifications including SOC 2 and GDPR.",
      image: {
        src: "https://images.unsplash.com/photo-1515114344263-dd52070dae35?w=900&auto=format&fit=crop&q=60",
        alt: "Security",
      },
      features: [
        { id: "d1", text: "End-to-end encryption" },
        { id: "d2", text: "SSO & SAML" },
        { id: "d3", text: "SOC 2 certified" },
      ],
    },
  ],
};

export function UseCase7({
  badge,
  heading,
  description,
  items,
  className,
}: UseCase7Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          {badge?.label && (
            <div className="mb-6 flex justify-center">
              <Badge variant={badge.variant ?? "secondary"}>
                {badge.label}
              </Badge>
            </div>
          )}
          {heading && (
            <h2 className="text-2xl md:text-4xl font-semibold text-balance max-w-4xl mx-auto">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Accordion */}
        <div className="max-w-4xl mx-auto space-y-3">
          {items.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-lg border overflow-hidden transition-all duration-300 border-foreground/10",
                  isExpanded && "bg-foreground/[0.02]"
                )}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-colors hover:bg-foreground/[0.02]"
                >
                  <div className="flex items-center gap-4">
                    {item.icon && (
                      <span className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary group-hover/usecase7:bg-primary group-hover/usecase7:text-background">
                        {item.icon}
                      </span>
                    )}
                    <span className="text-lg font-semibold group-hover/usecase7:text-foreground">
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-5 transition-transform duration-300 text-muted-foreground",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Accordion Content */}
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Image */}
                        {item.image && (
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <Image
                              src={item.image.src}
                              alt={item.image.alt}
                              width={800}
                              height={450}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="space-y-4">
                          <p className="text-muted-foreground text-base md:text-lg">
                            {item.description}
                          </p>

                          {item.features && item.features.length > 0 && (
                            <ul className="space-y-1.5">
                              {item.features.map((feature) => (
                                <li
                                  key={feature.id}
                                  className="flex items-center gap-2 text-base text-muted-foreground"
                                >
                                  <Check className="size-4 text-primary flex-shrink-0" />
                                  <span>{feature.text}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
