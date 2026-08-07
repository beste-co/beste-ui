"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Badge7 } from "@/components/beste/component/badge7";
import { Button12 } from "@/components/beste/component/button12";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface ActionButton {
  label: string;
  href: string;
}

interface ConfigImage {
  src: string;
  alt: string;
}

interface ConfigChoice {
  value: string;
  label: string;
  description?: string;
  /** Takes over the plate while this option is the one selected */
  image?: ConfigImage;
  caption?: string;
  /** How this option reads in the specification */
  spec: string;
  /** Added to the base price. Negative is allowed. */
  price?: number;
}

interface ConfigStep {
  /** Form field name. Must be unique across the configurator. */
  name: string;
  title: string;
  description?: string;
  /** Row label in the specification */
  specLabel: string;
  choices?: ConfigChoice[];
}

interface Closing {
  title: string;
  description: string;
}

interface Product12Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  specTitle?: string;
  priceLabel?: string;
  pending?: string;
}

interface Product12Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  steps?: ConfigStep[];
  /** Prints a scoped shortcut on every choice and binds it while the step is active */
  shortcuts?: "letters" | "numbers";
  /** Every option's price is added to this */
  basePrice?: number;
  /** Prefix printed in front of the total */
  currency?: string;
  /** Plate shown before anything has been chosen */
  image?: ConfigImage;
  caption?: string;
  /** Replaces the questions once the specification is sent */
  closing?: Closing;
  button?: ActionButton;
  labels?: Product12Labels;
  className?: string;
}

/** Thousands separator without toLocaleString, which drifts between server and client. */
function formatPrice(amount: number, currency: string) {
  return `${currency}${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export const product12Demo: Product12Props = {
  badge: { label: "Made to order" },
  heading: "Specify the chair while you look at it.",
  description:
    "Every answer changes the plate on the left and the line it writes into the specification. Nothing is hidden until the end.",
  shortcuts: "numbers",
  basePrice: 480,
  currency: "£",
  image: {
    src: "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&h=1400&fit=crop",
    alt: "Wooden chair standing alone in a bright room",
  },
  caption: "The Aro chair, built in the workshop in batches of twelve.",
  labels: {
    submit: "Send this specification",
    restart: "Specify another",
    specTitle: "Specification",
    priceLabel: "Total, before delivery",
    pending: "Not chosen yet",
  },
  steps: [
    {
      name: "frame",
      title: "Which frame?",
      description: "The part that decides how heavy the chair looks in a room.",
      specLabel: "Frame",
      choices: [
        {
          value: "oak",
          label: "Oiled oak",
          description: "Pale, open grain, and it lightens over the years.",
          spec: "Oiled European oak",
          price: 0,
          image: {
            src: "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&h=1400&fit=crop",
            alt: "Pale oak chair against a white wall",
          },
          caption: "Oak is the standing frame, and the one most people keep.",
        },
        {
          value: "ash",
          label: "Blackened ash",
          description: "Closed grain, near black, and it hides a working room.",
          spec: "Blackened ash",
          price: 60,
          image: {
            src: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&h=1400&fit=crop",
            alt: "Dark timber chair beside a window",
          },
          caption: "Ash is dyed rather than painted, so the grain still reads up close.",
        },
        {
          value: "steel",
          label: "Waxed steel",
          description: "Thinner in section, heavier in the hand, and it marks.",
          spec: "Waxed steel, 16mm section",
          price: 140,
          image: {
            src: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&h=1400&fit=crop",
            alt: "Metal framed chair on a plain floor",
          },
          caption: "Steel frames are welded here and waxed by hand, so no two age alike.",
        },
      ],
    },
    {
      name: "seat",
      title: "What sits on it?",
      specLabel: "Seat",
      choices: [
        {
          value: "canvas",
          label: "Cotton canvas",
          description: "Washable, replaceable, and it softens in a season.",
          spec: "16oz cotton canvas, natural",
          price: 0,
        },
        {
          value: "leather",
          label: "Vegetable-tanned leather",
          description: "Stiff for a month, then it takes your shape and keeps it.",
          spec: "Vegetable-tanned leather, 3mm",
          price: 180,
        },
        {
          value: "cane",
          label: "Hand-woven cane",
          description: "Lighter to carry, and it lets a warm room breathe.",
          spec: "Hand-woven cane panel",
          price: 120,
        },
      ],
    },
    {
      name: "finish",
      title: "How should it be finished?",
      description: "This decides how it is looked after, not how it looks.",
      specLabel: "Finish",
      choices: [
        {
          value: "oiled",
          label: "Oiled",
          description: "Re-oil it once a year. Scratches disappear into it.",
          spec: "Hard-wax oil, matte",
          price: 0,
        },
        {
          value: "lacquered",
          label: "Lacquered",
          description: "Wipes clean, survives a kitchen, and cannot be patched.",
          spec: "Water-based lacquer, satin",
          price: 45,
        },
      ],
    },
  ],
  closing: {
    title: "Specification sent",
    description:
      "The workshop replies inside three working days with a build slot and a delivery window. Nothing is charged until you confirm both.",
  },
  button: { label: "Book a workshop visit", href: "https://beste.co" },
};

export function Product12({
  badge,
  heading,
  description,
  steps = [],
  shortcuts,
  basePrice = 0,
  currency = "$",
  image,
  caption,
  closing,
  button,
  labels = {},
  className,
}: Product12Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    specTitle,
    priceLabel,
    pending,
  } = labels;

  const [picked, setPicked] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const chosen = (step: ConfigStep) =>
    step.choices?.find((choice) => choice.value === picked[step.name]);

  /** The last chosen option that carries a plate is the one on screen. */
  const platedStep = [...steps].reverse().find((step) => chosen(step)?.image);
  const plated = platedStep ? chosen(platedStep) : undefined;
  const shownImage = plated?.image ?? image;
  const shownCaption = plated?.caption ?? caption;

  const total = steps.reduce((sum, step) => sum + (chosen(step)?.price ?? 0), basePrice);

  const record = (step: ConfigStep, value: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) return;
    setPicked((previous) => ({ ...previous, [step.name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const restart = () => {
    setPicked({});
    setSent(false);
  };

  return (
    <section className={cn("w-full py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
          <div>
            {badge && <Badge7 label={badge.label} />}
            {heading && (
              <h2 className="mt-6 max-w-2xl text-balance text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
          </div>
          {description && (
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl">
              {description}
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="relative h-96 overflow-hidden rounded-md bg-muted md:h-[34rem]">
              {shownImage && (
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={shownImage.src}
                  alt={shownImage.alt}
                />
              )}
            </div>
            {shownCaption && (
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {shownCaption}
              </p>
            )}
          </div>

          <div>
            {sent && closing ? (
              <>
                <p className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  {closing.title}
                </p>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  {closing.description}
                </p>
              </>
            ) : (
              <Questionnaire
                defaultItem={steps[0]?.name}
                shortcuts={shortcuts}
                onSubmit={handleSubmit}
                className="gap-6"
              >
                {steps.length > 0 && <QuestionnaireProgress className="text-base" />}

                {steps.map((step, index) => (
                  <QuestionnaireItem key={index} name={step.name} required>
                    <QuestionnaireTitle className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                      {step.title}
                    </QuestionnaireTitle>
                    {step.description && (
                      <QuestionnaireDescription className="text-base text-muted-foreground md:text-lg">
                        {step.description}
                      </QuestionnaireDescription>
                    )}
                    <QuestionnaireChoices>
                      {step.choices?.map((choice, choiceIndex) => (
                        <QuestionnaireChoice
                          key={choiceIndex}
                          value={choice.value}
                          onChange={record(step, choice.value)}
                          className="rounded-md p-4 text-base data-checked:border-foreground"
                        >
                          <span className="font-bold text-foreground">{choice.label}</span>
                          {choice.description && (
                            <QuestionnaireChoiceDescription className="text-base">
                              {choice.description}
                            </QuestionnaireChoiceDescription>
                          )}
                        </QuestionnaireChoice>
                      ))}
                    </QuestionnaireChoices>
                    <QuestionnaireError className="text-base" />
                  </QuestionnaireItem>
                ))}

                <QuestionnaireActions>
                  <QuestionnairePrevious className="cursor-pointer rounded-full text-base">
                    {previousLabel}
                  </QuestionnairePrevious>
                  <QuestionnaireNext className="cursor-pointer rounded-full bg-foreground text-base text-background hover:bg-foreground/90">
                    {nextLabel}
                  </QuestionnaireNext>
                  <QuestionnaireSubmit className="cursor-pointer rounded-full bg-foreground text-base text-background hover:bg-foreground/90">
                    {submitLabel}
                  </QuestionnaireSubmit>
                </QuestionnaireActions>
              </Questionnaire>
            )}

            {steps.length > 0 && (
              <div className="mt-10">
                {specTitle && <Badge7 label={specTitle} />}

                <dl className="mt-5 flex flex-col">
                  {steps.map((step, index) => {
                    const option = chosen(step);
                    return (
                      <div
                        key={index}
                        className="grid gap-1 border-t border-current/10 py-4 sm:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] sm:gap-6"
                      >
                        <dt className="text-base text-muted-foreground md:text-lg">
                          {step.specLabel}
                        </dt>
                        <dd
                          className={cn(
                            "text-base md:text-lg",
                            option
                              ? "font-bold text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {option ? option.spec : (pending ?? "Not chosen yet")}
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-current/10 pt-6">
                  <p className="text-base text-muted-foreground md:text-lg">
                    {priceLabel ?? "Total"}
                  </p>
                  <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground md:text-3xl">
                    {formatPrice(total, currency)}
                  </p>
                </div>

                {sent && (
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    {button && (
                      <Button12 asChild label={button.label}>
                        <Link href={button.href} />
                      </Button12>
                    )}
                    <Button12
                      label={restartLabel ?? "Specify another"}
                      tone="outline"
                      icon={RotateCcw}
                      onClick={restart}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
