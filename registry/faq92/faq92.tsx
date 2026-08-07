"use client";

import { ArrowUpRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { type FormEvent, type ReactNode, useState } from "react";
import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { Chat34 } from "@/components/beste/piece/chat34";
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

interface ActionLink {
  label: string;
  href: string;
}

interface RouterImage {
  src: string;
  alt: string;
}

interface RouterChoice {
  value: string;
  label: string;
  description?: string;
}

interface RouterQuestion {
  /** Form field name. Must be unique across the flow. */
  name: string;
  title: string;
  description?: string;
  choices?: RouterChoice[];
}

interface Answer {
  /**
   * Field name to answer value. An answer is only shown when every pair
   * matches. Leave it out on the last entry, which is the catch-all.
   */
  match?: Record<string, string>;
  title: string;
  description: string;
  link?: ActionLink;
  /** Replaces the standing photograph once this answer is shown */
  image?: RouterImage;
  /** Piece floated over the photograph once this answer is shown */
  media?: ReactNode;
  caption?: string;
}

interface Contact {
  title: string;
  description: string;
  link: ActionLink;
}

interface Faq92Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  answerTitle?: string;
}

interface Faq92Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  questions?: RouterQuestion[];
  /** Prints a scoped shortcut on every choice and binds it while the question is active */
  shortcuts?: "letters" | "numbers";
  /** Checked in order; the first one whose `match` fits the answers is shown. */
  answers?: Answer[];
  /** Standing photograph, shown until an answer is found */
  image?: RouterImage;
  /** Piece floated over the photograph before an answer is found */
  media?: ReactNode;
  caption?: string;
  /** Always shown under the photograph, for the times the routing was not enough */
  contact?: Contact;
  labels?: Faq92Labels;
  className?: string;
}

export const faq92Demo: Faq92Props = {
  badge: { label: "Help" },
  heading: "Two questions instead of a search box",
  description:
    "Most support tickets are one of a dozen questions wearing different words. Tell us where you are and what happened, and we will point at the page that answers it.",
  shortcuts: "numbers",
  image: {
    src: "https://images.unsplash.com/photo-1579508750794-1959a573f5e6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "An open notebook with a pen and a pair of glasses resting on it",
  },
  media: (
    <Chat34
      question="How do I change the card on the account?"
      answer="Any admin can update it in billing settings. The change applies to the next invoice rather than the one already issued."
      sourcesLabel="Answered from"
      sources={["Billing", "Roles"]}
    />
  ),
  caption: "Four people answer these, and they wrote the pages the router points at.",
  labels: {
    submit: "Show me the answer",
    restart: "Ask about something else",
    answerTitle: "Start here",
  },
  questions: [
    {
      name: "area",
      title: "What is this about?",
      description: "Pick the closest one. Nothing here creates a ticket.",
      choices: [
        {
          value: "billing",
          label: "Billing and invoices",
          description: "Charges, receipts, plans, and refunds.",
        },
        {
          value: "access",
          label: "Getting into the account",
          description: "Passwords, devices, and team access.",
        },
        {
          value: "data",
          label: "Data going in or out",
          description: "Imports, exports, and integrations.",
        },
      ],
    },
    {
      name: "state",
      title: "Where did it stop working?",
      choices: [
        { value: "before", label: "Before I could start" },
        { value: "during", label: "Halfway through, with an error" },
        { value: "after", label: "It finished, but the result is wrong" },
      ],
    },
  ],
  answers: [
    {
      match: { area: "billing", state: "after" },
      title: "The invoice does not match what you expected",
      description:
        "Mid-cycle plan changes are prorated to the day, so the next invoice carries both the credit and the new rate. The breakdown on the invoice shows each line separately.",
      link: { label: "Read how proration is calculated", href: "https://beste.co" },
      image: {
        src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=1400&fit=crop",
        alt: "Printed forms spread across a desk with a pen and a calculator",
      },
      media: (
        <Chat34
          question="Why is this invoice higher than the plan price?"
          answer="You changed plan on the 14th, so this one carries nine days at the old rate and the rest at the new one."
          sourcesLabel="Answered from"
          sources={["Invoices", "Proration"]}
        />
      ),
      caption: "Every invoice line is itemised, including the credit from the day you switched.",
    },
    {
      match: { area: "billing" },
      title: "Payments, plans, and receipts",
      description:
        "Card updates, VAT details, and past receipts all live in the billing settings, and any admin on the workspace can reach them.",
      link: { label: "Open the billing guide", href: "https://beste.co" },
    },
    {
      match: { area: "access", state: "before" },
      title: "You cannot get past the sign-in screen",
      description:
        "Reset links expire after fifteen minutes and only work once. If yours has run out, ask for a new one and open it in the same browser.",
      link: { label: "Reset your password", href: "https://beste.co" },
      image: {
        src: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200&h=1400&fit=crop",
        alt: "Somebody sitting at a desktop computer, waiting on the screen",
      },
      media: (
        <Chat34
          question="My reset link says it has already been used."
          answer="They last fifteen minutes and work once. Ask for a new one and open it in the browser you asked from."
          sourcesLabel="Answered from"
          sources={["Sign-in", "Sessions"]}
        />
      ),
      caption: "Reset links are single use, which is why the second click never works.",
    },
    {
      match: { area: "access" },
      title: "Access, devices, and who can see what",
      description:
        "Roles decide what each person can open. An admin can change a role at any time, and the change applies the next time that person loads the page.",
      link: { label: "See the roles table", href: "https://beste.co" },
    },
    {
      match: { area: "data", state: "during" },
      title: "An import stopped partway",
      description:
        "Nothing is written until the whole file validates, so a failed import leaves your data untouched. The error names the first row it could not read.",
      link: { label: "Fix a rejected import", href: "https://beste.co" },
      image: {
        src: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&h=1400&fit=crop",
        alt: "A line chart drawn on graph paper beside a ruler and two pens",
      },
      media: (
        <Chat34
          question="The import stopped on row 412."
          answer="Nothing was written. Row 412 carries a date in a format we do not read, and the whole file goes through once it is fixed."
          sourcesLabel="Answered from"
          sources={["Imports", "Field mapping"]}
        />
      ),
      caption: "A rejected file changes nothing. The row number in the error is where to look.",
    },
    {
      title: "Moving data in and out",
      description:
        "Exports run in the background and arrive by email as a signed link. Imports are checked against your existing records before anything is created.",
      link: { label: "Read the data guide", href: "https://beste.co" },
    },
  ],
  contact: {
    title: "Still not it?",
    description: "Send us the answers you just gave and a sentence about what you expected.",
    link: { label: "Write to support", href: "https://beste.co" },
  },
};

export function Faq92({
  badge,
  heading,
  description,
  questions = [],
  shortcuts,
  answers = [],
  image,
  media,
  caption,
  contact,
  labels = {},
  className,
}: Faq92Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    answerTitle,
  } = labels;

  const [answer, setAnswer] = useState<Answer | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const given: Record<string, string> = {};
    for (const question of questions) {
      given[question.name] = String(data.get(question.name) ?? "");
    }

    // The last entry stands in when nothing fits, so a submit never dead-ends.
    const matched = answers.find((entry) =>
      Object.entries(entry.match ?? {}).every(([name, value]) => given[name] === value)
    );
    setAnswer(matched ?? answers[answers.length - 1] ?? null);
  };

  const restart = () => setAnswer(null);

  const shownImage = answer?.image ?? image;
  const shownMedia = answer?.media ?? media;
  const shownCaption = answer?.caption ?? caption;

  return (
    <section className={cn("w-full bg-background py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {badge && <Badge23 label={badge.label} />}

        <div className="mt-6 border-t border-border pt-8 md:pt-10">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            {heading && (
              <h2 className="text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <div className="flex md:justify-end">
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            {answer ? (
              <>
                {answerTitle && <p className="text-sm text-muted-foreground">{answerTitle}</p>}
                <p className="mt-3 text-2xl font-light tracking-tight text-foreground md:text-3xl">
                  {answer.title}
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {answer.description}
                </p>

                {answer.link && (
                  <Link
                    href={answer.link.href}
                    className="group/faq92 mt-6 inline-flex items-center gap-2 border-b border-primary/40 pb-1 text-base text-foreground transition-colors hover:text-primary"
                  >
                    {answer.link.label}
                    <ArrowUpRight
                      className="size-4 transition-transform motion-safe:group-hover/faq92:-translate-y-0.5 motion-safe:group-hover/faq92:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                )}

                <div className="mt-8">
                  <Button21
                    label={restartLabel ?? "Ask about something else"}
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
                {questions.length > 0 && (
                  <QuestionnaireProgress className="text-sm font-normal tracking-normal" />
                )}

                {questions.map((question, index) => (
                  <QuestionnaireItem key={index} name={question.name} required>
                    <QuestionnaireTitle className="text-xl font-medium text-foreground">
                      {question.title}
                    </QuestionnaireTitle>
                    {question.description && (
                      <QuestionnaireDescription className="text-base leading-relaxed">
                        {question.description}
                      </QuestionnaireDescription>
                    )}
                    <QuestionnaireChoices>
                      {question.choices?.map((choice, choiceIndex) => (
                        <QuestionnaireChoice
                          key={choiceIndex}
                          value={choice.value}
                          className="rounded-md border-border p-4 text-base"
                        >
                          <span className="font-medium text-foreground">{choice.label}</span>
                          {choice.description && (
                            <QuestionnaireChoiceDescription className="text-sm">
                              {choice.description}
                            </QuestionnaireChoiceDescription>
                          )}
                        </QuestionnaireChoice>
                      ))}
                    </QuestionnaireChoices>
                    <QuestionnaireError className="text-sm" />
                  </QuestionnaireItem>
                ))}

                <QuestionnaireActions>
                  <QuestionnairePrevious className="cursor-pointer rounded-md border-border text-sm font-medium">
                    {previousLabel}
                  </QuestionnairePrevious>
                  <QuestionnaireNext className="cursor-pointer rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    {nextLabel}
                  </QuestionnaireNext>
                  <QuestionnaireSubmit className="cursor-pointer rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    {submitLabel}
                  </QuestionnaireSubmit>
                </QuestionnaireActions>
              </Questionnaire>
            )}
          </div>

          <div>
            <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-md bg-muted lg:h-[24rem]">
              {shownImage && (
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={shownImage.src}
                  alt={shownImage.alt}
                />
              )}
              <div className="relative z-10 size-full">{shownMedia}</div>
            </div>

            {shownCaption && (
              <p className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
                {shownCaption}
              </p>
            )}
          </div>
        </div>

        {contact && (
          <div className="mt-10 flex flex-col gap-4 rounded-md bg-muted p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div className="max-w-xl">
              <p className="text-lg font-medium text-foreground">{contact.title}</p>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {contact.description}
              </p>
            </div>
            <Button21 asChild label={contact.link.label} tone="outline">
              <Link href={contact.link.href} />
            </Button21>
          </div>
        )}
      </div>
    </section>
  );
}
