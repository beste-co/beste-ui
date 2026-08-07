"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
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

interface ProductImage {
  src: string;
  alt: string;
}

interface FinderChoice {
  value: string;
  label: string;
  description?: string;
  /** Traits this answer asks for. A product scores one point per trait it has. */
  traits?: string[];
  /** Line printed in the result's reasons list when this answer is picked */
  reason?: string;
}

interface FinderQuestion {
  /** Form field name. Must be unique across the finder. */
  name: string;
  title: string;
  description?: string;
  choices?: FinderChoice[];
  /** Renders the choices as checkboxes instead of radios */
  multiple?: boolean;
}

interface Product {
  name: string;
  price: string;
  summary: string;
  image: ProductImage;
  /** Matched against the traits the answers ask for */
  traits?: string[];
  button: ActionButton;
}

interface Ecommerce46Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  resultTitle?: string;
  reasonsTitle?: string;
}

interface Ecommerce46Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  questions?: FinderQuestion[];
  /** Prints a scoped shortcut on every choice and binds it while the question is active */
  shortcuts?: "letters" | "numbers";
  /** Scored against the answers; the highest score wins, ties go to the first. */
  products?: Product[];
  /** Shown beside the questions, before anything has been answered */
  image?: ProductImage;
  caption?: string;
  labels?: Ecommerce46Labels;
  className?: string;
}

export const ecommerce46Demo: Ecommerce46Props = {
  badge: { label: "Find your bag" },
  heading: "Three questions, one bag.",
  description:
    "Rather than filter twelve bags by six attributes, tell us how you travel. We name one bag and say exactly why it came out on top.",
  shortcuts: "numbers",
  image: {
    src: "https://images.unsplash.com/photo-1760565030401-c37ce3432ad6?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "A black backpack held up by its handle against a plain background",
  },
  caption:
    "Twelve bags in the range, each one carried loaded before it was signed off. Only one of them is the answer to your particular week.",
  labels: {
    submit: "See my match",
    restart: "Answer again",
    resultTitle: "Your match",
    reasonsTitle: "Why this one",
  },
  questions: [
    {
      name: "trip",
      title: "How long are you usually away?",
      description: "The most common trip, not the longest one you have ever taken.",
      choices: [
        {
          value: "day",
          label: "Out and back in a day",
          description: "Laptop, notebook, and lunch.",
          traits: ["compact", "laptop"],
          reason: "Sized for a day out rather than a week away",
        },
        {
          value: "weekend",
          label: "Two or three nights",
          description: "Enough clothes to not do laundry.",
          traits: ["weekend", "expandable"],
          reason: "Holds two or three nights without a second bag",
        },
        {
          value: "week",
          label: "A week or more",
          description: "Packing cubes are involved.",
          traits: ["large", "expandable"],
          reason: "Deep main compartment for a week of packing",
        },
      ],
    },
    {
      name: "carry",
      title: "How do you want to carry it?",
      choices: [
        {
          value: "back",
          label: "On my back",
          traits: ["straps"],
          reason: "Padded harness that takes the weight off one shoulder",
        },
        {
          value: "hand",
          label: "In one hand",
          traits: ["handle", "compact"],
          reason: "Balanced handle, so it hangs level when it is full",
        },
        {
          value: "wheels",
          label: "On wheels",
          traits: ["wheels", "large"],
          reason: "Wheels and a locking handle for long terminals",
        },
      ],
    },
    {
      name: "needs",
      title: "Anything it has to survive?",
      description: "Pick as many as apply.",
      multiple: true,
      choices: [
        {
          value: "rain",
          label: "Rain, regularly",
          traits: ["waterproof"],
          reason: "Coated shell and covered zips for wet platforms",
        },
        {
          value: "overhead",
          label: "Overhead lockers",
          traits: ["cabin"],
          reason: "Within cabin size on every airline we checked",
        },
        {
          value: "kit",
          label: "A camera or tools",
          traits: ["padded"],
          reason: "Padded divider that stays put when the bag is half empty",
        },
      ],
    },
  ],
  products: [
    {
      name: "Halden 18 Daypack",
      price: "$180",
      summary:
        "An eighteen litre pack that keeps its shape empty, with a laptop sleeve that sits off the floor.",
      image: {
        src: "https://images.unsplash.com/photo-1760564877882-9b7c9f4a3e9b?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Charcoal daypack standing upright against a plain wall",
      },
      traits: ["compact", "laptop", "straps", "waterproof", "padded", "cabin"],
      button: { label: "See the Halden 18", href: "https://beste.co" },
    },
    {
      name: "Norr Weekender",
      price: "$320",
      summary:
        "A flat-packing weekend bag that expands by six litres when the trip runs long, carried by hand or on the back.",
      image: {
        src: "https://images.unsplash.com/photo-1760564877791-50863c5773da?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Black weekend bag with tan leather straps resting on a rock",
      },
      traits: ["weekend", "expandable", "handle", "straps", "cabin", "padded"],
      button: { label: "See the Norr Weekender", href: "https://beste.co" },
    },
    {
      name: "Vante 65 Roller",
      price: "$460",
      summary:
        "A sixty-five litre case on sealed wheels, with a compression panel that keeps a week of clothes from moving.",
      image: {
        src: "https://images.unsplash.com/photo-1760565031198-00e39da3d9cb?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Hard-shell rolling suitcase photographed from the side",
      },
      traits: ["large", "wheels", "expandable", "waterproof"],
      button: { label: "See the Vante 65", href: "https://beste.co" },
    },
  ],
};

export function Ecommerce46({
  badge,
  heading,
  description,
  questions = [],
  shortcuts,
  products = [],
  image,
  caption,
  labels = {},
  className,
}: Ecommerce46Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    resultTitle,
    reasonsTitle,
  } = labels;

  const [result, setResult] = useState<{ product: Product; reasons: string[] } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const picked: FinderChoice[] = [];
    for (const question of questions) {
      const values = data.getAll(question.name).map((entry) => String(entry));
      for (const value of values) {
        const choice = question.choices?.find((entry) => entry.value === value);
        if (choice) picked.push(choice);
      }
    }

    const wanted = picked.flatMap((choice) => choice.traits ?? []);
    let best: Product | undefined;
    let bestScore = -1;
    for (const product of products) {
      const score = wanted.filter((trait) => product.traits?.includes(trait)).length;
      if (score > bestScore) {
        best = product;
        bestScore = score;
      }
    }

    if (!best) return;
    const winner = best;

    // Only the answers the winning product actually satisfies are worth printing.
    const reasons = picked
      .filter((choice) => (choice.traits ?? []).some((trait) => winner.traits?.includes(trait)))
      .map((choice) => choice.reason)
      .filter((reason): reason is string => Boolean(reason));

    setResult({ product: winner, reasons });
  };

  const restart = () => setResult(null);

  const shownImage = result?.product.image ?? image;

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
            <div className="relative h-96 overflow-hidden rounded-md bg-muted lg:h-[34rem]">
              {shownImage && (
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={shownImage.src}
                  alt={shownImage.alt}
                />
              )}
            </div>
            {!result && caption && (
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {caption}
              </p>
            )}
            {result && (
              <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
                <p className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  {result.product.name}
                </p>
                <p className="text-xl font-bold tabular-nums text-foreground md:text-2xl">
                  {result.product.price}
                </p>
              </div>
            )}
          </div>

          <div>
            {result ? (
              <>
                {resultTitle && <Badge7 label={resultTitle} />}
                <p className="mt-6 text-xl leading-relaxed text-foreground md:text-2xl">
                  {result.product.summary}
                </p>

                {result.reasons.length > 0 && (
                  <div className="mt-8">
                    {reasonsTitle && (
                      <p className="text-lg font-bold tracking-tight text-foreground">
                        {reasonsTitle}
                      </p>
                    )}
                    <ul className="mt-4 flex flex-col">
                      {result.reasons.map((reason, index) => (
                        <li
                          key={index}
                          className="border-t border-current/10 py-4 text-lg leading-relaxed text-muted-foreground"
                        >
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button12 asChild label={result.product.button.label}>
                    <Link href={result.product.button.href} />
                  </Button12>
                  <Button12
                    label={restartLabel ?? "Answer again"}
                    tone="outline"
                    icon={RotateCcw}
                    onClick={restart}
                  />
                </div>
              </>
            ) : (
              <Questionnaire
                defaultItem={questions[0]?.name}
                shortcuts={shortcuts}
                onSubmit={handleSubmit}
                className="gap-6"
              >
                {questions.length > 0 && <QuestionnaireProgress className="text-base" />}

                {questions.map((question, index) => (
                  <QuestionnaireItem
                    key={index}
                    name={question.name}
                    required={!question.multiple}
                    multiple={question.multiple}
                  >
                    <QuestionnaireTitle className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                      {question.title}
                    </QuestionnaireTitle>
                    {question.description && (
                      <QuestionnaireDescription className="text-base text-muted-foreground md:text-lg">
                        {question.description}
                      </QuestionnaireDescription>
                    )}
                    <QuestionnaireChoices>
                      {question.choices?.map((choice, choiceIndex) => (
                        <QuestionnaireChoice
                          key={choiceIndex}
                          value={choice.value}
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
          </div>
        </div>
      </div>
    </section>
  );
}
