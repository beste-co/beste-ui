"use client";

import { Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
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

interface SessionImage {
  src: string;
  alt: string;
}

interface SessionChoice {
  value: string;
  label: string;
  description?: string;
  /** Where it happens, printed in the plan */
  room: string;
  /** Length in whole minutes. Summed into the day's total. */
  minutes: number;
  image?: SessionImage;
}

interface SlotQuestion {
  /** Form field name. Must be unique across the day. */
  name: string;
  /** Start time, printed down the left of the plan */
  time: string;
  title: string;
  description?: string;
  choices?: SessionChoice[];
}

interface Confirmation {
  title: string;
  description: string;
}

interface Event101Labels {
  previous?: string;
  next?: string;
  submit?: string;
  restart?: string;
  planTitle?: string;
  emptyLabel?: string;
  totalLabel?: string;
  hour?: string;
  minute?: string;
}

interface Event101Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  /** One question per slot, in the order the day runs */
  slots?: SlotQuestion[];
  /** Prints a scoped shortcut on every choice and binds it while the slot is active */
  shortcuts?: "letters" | "numbers";
  /** Replaces the questions once the day is confirmed */
  confirmation?: Confirmation;
  button?: ActionLink;
  labels?: Event101Labels;
  className?: string;
}

/** "2 hr 40 min", without a locale API that can drift between server and client. */
function formatMinutes(total: number, hour: string, minute: string) {
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (hours === 0) return `${rest} ${minute}`;
  if (rest === 0) return `${hours} ${hour}`;
  return `${hours} ${hour} ${rest} ${minute}`;
}

export const event101Demo: Event101Props = {
  badge: { label: "Build your day" },
  heading: "Four slots, and you can see the gaps you leave",
  description:
    "The programme is not a list of everything happening at once. Pick one thing per slot and the day fills in beside you, including the hours you decided to keep empty.",
  shortcuts: "numbers",
  labels: {
    submit: "Save this day",
    restart: "Plan it again",
    planTitle: "Your day",
    emptyLabel: "Nothing booked yet",
    totalLabel: "booked",
    hour: "hr",
    minute: "min",
  },
  confirmation: {
    title: "Day saved",
    description:
      "It is in your calendar with the room numbers attached. Swap anything up to the morning of, and the rooms follow the change.",
  },
  button: { label: "Add it to my calendar", href: "https://beste.co" },
  slots: [
    {
      name: "morning",
      time: "09:30",
      title: "How do you want to start?",
      description: "The room fills up, so this is the one worth deciding early.",
      choices: [
        {
          value: "keynote",
          label: "The opening talk",
          description: "One hour, one argument, no slides worth photographing.",
          room: "Main hall",
          minutes: 60,
          image: {
            src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop",
            alt: "A speaker alone on a round stage with the audience seated around it",
          },
        },
        {
          value: "workshop",
          label: "Hands on the tools",
          description: "Bring a laptop. You will build something small and break it twice.",
          room: "Studio 2",
          minutes: 90,
          image: {
            src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
            alt: "Three people working at a table with their laptops open",
          },
        },
      ],
    },
    {
      name: "midday",
      time: "11:30",
      title: "And before lunch?",
      choices: [
        {
          value: "panel",
          label: "The disagreement panel",
          description: "Four people who genuinely do not agree, moderated firmly.",
          room: "Main hall",
          minutes: 45,
          image: {
            src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop",
            alt: "A speaker taking questions from a seated group in a brick-walled room",
          },
        },
        {
          value: "clinic",
          label: "Bring your problem",
          description: "Fifteen minutes with somebody who has solved it before.",
          room: "Room 4",
          minutes: 30,
          image: {
            src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=600&fit=crop",
            alt: "Four people talking around a small table",
          },
        },
      ],
    },
    {
      name: "afternoon",
      time: "14:00",
      title: "The afternoon is the quiet one.",
      description: "Most people fade here. Pick accordingly.",
      choices: [
        {
          value: "case",
          label: "A case study, told honestly",
          description: "Including the eighteen months where it did not work.",
          room: "Studio 1",
          minutes: 45,
          image: {
            src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
            alt: "A presenter at a wall of notes with a group seated at the table",
          },
        },
        {
          value: "walk",
          label: "The walking session",
          description: "Outside, in a group of eight, no screens.",
          room: "Meet at reception",
          minutes: 60,
          image: {
            src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop",
            alt: "Pine forest along the walking route",
          },
        },
      ],
    },
    {
      name: "close",
      time: "16:30",
      title: "How does it end?",
      choices: [
        {
          value: "closing",
          label: "The closing talk",
          description: "Thirty minutes, and it does try to tie the day together.",
          room: "Main hall",
          minutes: 30,
          image: {
            src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop",
            alt: "A speaker alone on a round stage with the audience seated around it",
          },
        },
        {
          value: "drinks",
          label: "Straight to the bar",
          description: "The honest option, and the one where the useful talking happens.",
          room: "Courtyard",
          minutes: 90,
          image: {
            src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop",
            alt: "An evening gathering outdoors under string lights",
          },
        },
      ],
    },
  ],
};

export function Event101({
  badge,
  heading,
  description,
  slots = [],
  shortcuts,
  confirmation,
  button,
  labels = {},
  className,
}: Event101Props) {
  const {
    previous: previousLabel,
    next: nextLabel,
    submit: submitLabel,
    restart: restartLabel,
    planTitle,
    emptyLabel,
    totalLabel,
    hour,
    minute,
  } = labels;

  const [picked, setPicked] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const chosen = (slot: SlotQuestion) =>
    slot.choices?.find((choice) => choice.value === picked[slot.name]);

  const booked = slots.filter((slot) => chosen(slot));
  const total = booked.reduce((sum, slot) => sum + (chosen(slot)?.minutes ?? 0), 0);

  const record = (slot: SlotQuestion, value: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) return;
    setSaved(false);
    setPicked((previous) => ({ ...previous, [slot.name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  const restart = () => {
    setPicked({});
    setSaved(false);
  };

  return (
    <section className={cn("w-full bg-background py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
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

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <div>
            {saved && confirmation ? (
              <>
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-5 text-2xl font-light tracking-tight text-foreground md:text-3xl">
                  {confirmation.title}
                </p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {confirmation.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {button && (
                    <Button21 asChild label={button.label}>
                      <Link href={button.href} />
                    </Button21>
                  )}
                  <Button21
                    label={restartLabel ?? "Plan it again"}
                    tone="outline"
                    icon={RotateCcw}
                    onClick={restart}
                  />
                </div>
              </>
            ) : (
              <Questionnaire
                defaultItem={slots[0]?.name}
                shortcuts={shortcuts}
                onSubmit={handleSubmit}
                className="gap-6"
              >
                {slots.length > 0 && (
                  <QuestionnaireProgress className="text-sm font-normal tracking-normal" />
                )}

                {slots.map((slot, index) => (
                  <QuestionnaireItem key={index} name={slot.name} required>
                    <QuestionnaireTitle className="text-xl font-medium text-foreground">
                      {slot.title}
                    </QuestionnaireTitle>
                    {slot.description && (
                      <QuestionnaireDescription className="text-base leading-relaxed">
                        {slot.description}
                      </QuestionnaireDescription>
                    )}
                    <QuestionnaireChoices>
                      {slot.choices?.map((choice, choiceIndex) => (
                        <QuestionnaireChoice
                          key={choiceIndex}
                          value={choice.value}
                          onChange={record(slot, choice.value)}
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
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              {planTitle && <p className="text-sm text-muted-foreground">{planTitle}</p>}
              <p className="text-sm text-muted-foreground">
                <span className="text-primary">
                  {booked.length} of {slots.length}
                </span>{" "}
                {totalLabel ?? "booked"}
                {total > 0 && (
                  <span className="tabular-nums">
                    , {formatMinutes(total, hour ?? "hr", minute ?? "min")}
                  </span>
                )}
              </p>
            </div>

            <div className="mt-5">
              {slots.map((slot, index) => {
                const session = chosen(slot);
                return (
                  <div
                    key={index}
                    className="flex gap-5 border-b border-border py-5 first:border-t md:gap-8"
                  >
                    <div className="flex w-16 shrink-0 items-start gap-3 md:w-20">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-2 size-2 shrink-0 rounded-full",
                          session ? "bg-primary" : "bg-border"
                        )}
                      />
                      <span className="text-base tabular-nums text-foreground">{slot.time}</span>
                    </div>

                    {session ? (
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        {session.image && (
                          <img
                            className="size-16 shrink-0 rounded-md object-cover md:size-20"
                            src={session.image.src}
                            alt={session.image.alt}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-lg font-medium text-foreground">{session.label}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {session.room}
                            {", "}
                            <span className="tabular-nums">
                              {formatMinutes(session.minutes, hour ?? "hr", minute ?? "min")}
                            </span>
                          </p>
                          {session.description && (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {session.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-w-0 flex-1 items-center">
                        <p className="text-base text-muted-foreground">
                          {emptyLabel ?? "Nothing booked yet"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
