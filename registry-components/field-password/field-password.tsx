"use client";

import { ArrowBigUp, Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Surface of the field. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Field size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export interface PasswordStrength {
  /** 0 (too weak) to 4 (very strong). */
  score: 0 | 1 | 2 | 3 | 4;
  /** Estimated bits, after the penalties for repeats, runs, common words and the reader's own details. */
  entropy: number;
  label: string;
  /** The most useful next step, or an empty string once the password is strong. */
  feedback: string;
}

export interface FieldPasswordProps {
  label?: string;
  description?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires when the password starts or stops passing every rule and the minimum score. */
  onValidChange?: (valid: boolean) => void;
  /** Rules shown as a checklist. Defaults to length, lower and upper case, a number and a symbol. `false` hides the list. */
  rules?: PasswordRule[] | false;
  /** Length the default length rule asks for. */
  minLength?: number;
  /** Lowest strength score that counts as valid, 0 to 4. */
  minScore?: number;
  /** Details the password should not contain, such as the email or the name. */
  userInputs?: string[];
  /** Meter under the field. Off by default for `current-password`. */
  showStrength?: boolean;
  /** "new-password" (default) for sign-up and change forms, "current-password" for sign-in. */
  autoComplete?: "new-password" | "current-password";
  name?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  tone?: Tone;
  size?: Size;
  className?: string;
}

export const fieldPasswordDemo: FieldPasswordProps = {
  label: "Create a password",
  description: "Use at least 12 characters. A short sentence works well.",
  userInputs: ["hello@beste.co", "Nina Simone"],
  placeholder: "Something only you would say",
  className: "w-full max-w-sm",
};

const toneStyles: Record<Tone, string> = {
  muted: "border-transparent bg-muted shadow-none dark:bg-muted",
  outline: "border-border bg-background",
  ghost: "border-transparent bg-transparent shadow-none hover:border-border",
};

const sizeStyles: Record<Size, { input: string; toggle: string }> = {
  sm: { input: "h-8 text-sm pe-9", toggle: "size-7 [&_svg]:size-4" },
  default: { input: "h-9 text-sm pe-10", toggle: "size-8 [&_svg]:size-4" },
  lg: { input: "h-11 text-base pe-12", toggle: "size-9 [&_svg]:size-5" },
};

// Same spring as inspector-slider: overshoots a hair, then settles
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const LABELS = ["Too weak", "Weak", "Fair", "Strong", "Very strong"] as const;

const METER_COLORS = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-emerald-500", "bg-emerald-500"] as const;

/** The checklist most sign-up forms need. */
export function defaultPasswordRules(minLength = 12): PasswordRule[] {
  return [
    { id: "length", label: `At least ${minLength} characters`, test: (v) => [...v].length >= minLength },
    { id: "lower", label: "A lowercase letter", test: (v) => /\p{Ll}/u.test(v) },
    { id: "upper", label: "An uppercase letter", test: (v) => /\p{Lu}/u.test(v) },
    { id: "number", label: "A number", test: (v) => /\d/.test(v) },
    { id: "symbol", label: "A symbol", test: (v) => /[^\p{L}\d\s]/u.test(v) },
  ];
}

// The passwords and words that show up first in every leaked list
const COMMON = [
  "password", "passw0rd", "123456", "12345678", "qwerty", "qwertyuiop", "asdfgh", "zxcvbn", "letmein", "welcome",
  "admin", "login", "iloveyou", "monkey", "dragon", "sunshine", "princess", "football", "baseball", "master",
  "shadow", "superman", "batman", "trustno1", "secret", "freedom", "whatever", "starwars", "hello", "summer",
  "winter", "spring", "autumn", "love", "abc123", "111111", "000000", "changeme", "default", "access",
];

const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890"];

function unleet(value: string) {
  return value
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/0/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/[$5]/g, "s")
    .replace(/7/g, "t");
}

/** Estimates how hard a password is to guess, with penalties for the shortcuts people take. No dependencies. */
export function scorePassword(value: string, userInputs: string[] = []): PasswordStrength {
  const chars = [...value];
  if (chars.length === 0) return { score: 0, entropy: 0, label: LABELS[0], feedback: "" };

  let pool = 0;
  if (/\p{Ll}/u.test(value)) pool += 26;
  if (/\p{Lu}/u.test(value)) pool += 26;
  if (/\d/.test(value)) pool += 10;
  if (/[^\p{L}\d]/u.test(value)) pool += 33;
  if (/[^\p{ASCII}]/u.test(value)) pool += 60;
  const perChar = Math.log2(Math.max(pool, 10));

  // Each character costs full bits unless it is predictable from the ones before it
  const weight = chars.map(() => perChar);
  const lower = value.toLowerCase();
  let hint = "";
  for (let i = 2; i < chars.length; i++) {
    const a = (chars[i - 2] ?? "").toLowerCase();
    const b = (chars[i - 1] ?? "").toLowerCase();
    const c = (chars[i] ?? "").toLowerCase();
    const repeat = a === b && b === c;
    const step = b.charCodeAt(0) - a.charCodeAt(0);
    const run = Math.abs(step) === 1 && c.charCodeAt(0) - b.charCodeAt(0) === step;
    const row = KEYBOARD_ROWS.some((r) => r.includes(a + b + c) || [...r].reverse().join("").includes(a + b + c));
    if (repeat || run || row) {
      weight[i] = 1;
      if (i === 2 || weight[i - 1] !== 1) weight[i - 1] = Math.min(weight[i - 1] ?? perChar, 2);
      hint ||= repeat ? "Avoid repeated characters." : "Avoid runs like abc, 123 or qwerty.";
    }
  }

  // Known words and the reader's own details are worth only a few guesses, however long they are
  const flatten = (start: number, length: number, bits: number) => {
    for (let i = start; i < start + length && i < weight.length; i++) weight[i] = bits / length;
  };
  const plain = unleet(value);
  for (const word of COMMON) {
    // Digit-only words would be scrambled by the leet mapping, so both spellings are checked
    const direct = lower.indexOf(word);
    const at = direct >= 0 ? direct : plain.indexOf(word);
    if (word.length >= 4 && at >= 0) {
      flatten(at, word.length, 8);
      hint ||= "Avoid common passwords and words.";
    }
  }
  for (const input of userInputs) {
    for (const part of input.toLowerCase().split(/[^\p{L}\d]+/u)) {
      if (part.length < 3) continue;
      const at = lower.indexOf(part);
      if (at >= 0) {
        flatten(at, part.length, 4);
        hint ||= "Leave out your name and email.";
      }
    }
  }
  const year = lower.match(/(19|20)\d{2}/);
  if (year?.index !== undefined) {
    flatten(year.index, 4, 6);
    hint ||= "Years are easy to guess.";
  }

  const entropy = Math.round(weight.reduce((sum, w) => sum + w, 0));
  let score: PasswordStrength["score"] = entropy < 28 ? 0 : entropy < 40 ? 1 : entropy < 60 ? 2 : entropy < 80 ? 3 : 4;
  if (chars.length < 8 && score > 1) score = 1;
  if (!hint && score < 3) {
    hint = chars.length < 12 ? "Add a few more words or characters." : "Mix in another word, a number or a symbol.";
  }
  return { score, entropy, label: LABELS[score], feedback: score >= 3 ? "" : hint };
}

function useControllable<T>(value: T | undefined, fallback: T, onChange?: (next: T) => void) {
  const [inner, setInner] = React.useState(fallback);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = (next: T) => {
    if (!controlled) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

export function FieldPassword({
  label = "Password",
  description,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onValidChange,
  rules: rulesProp,
  minLength = 12,
  minScore = 2,
  userInputs,
  showStrength,
  autoComplete = "new-password",
  name,
  id: idProp,
  placeholder,
  required,
  disabled,
  tone = "outline",
  size = "default",
  className,
}: FieldPasswordProps) {
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);
  const [visible, setVisible] = React.useState(false);
  const [capsLock, setCapsLock] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const selection = React.useRef<[number, number] | null>(null);
  const reactId = React.useId();
  const id = idProp ?? `field-password-${reactId}`;

  const creating = autoComplete === "new-password";
  const usingDefaults = rulesProp === undefined;
  const rules = React.useMemo(
    () => (rulesProp === false ? [] : (rulesProp ?? (creating ? defaultPasswordRules(minLength) : []))),
    [rulesProp, creating, minLength],
  );
  const meter = showStrength ?? creating;
  const inputsKey = (userInputs ?? []).join("\n");
  // biome-ignore lint/correctness/useExhaustiveDependencies: inputsKey stands in for the array
  const strength = React.useMemo(() => scorePassword(value, userInputs), [value, inputsKey]);
  const results = rules.map((rule) => ({ rule, met: rule.test(value) }));
  const valid = results.every((r) => r.met) && (!meter || strength.score >= minScore);

  const validRef = React.useRef<boolean | null>(null);
  const onValidRef = React.useRef(onValidChange);
  onValidRef.current = onValidChange;
  React.useEffect(() => {
    if (validRef.current === valid) return;
    validRef.current = valid;
    onValidRef.current?.(valid);
  }, [valid]);

  // Changing the type resets the caret in some browsers, so it is put back where it was
  React.useLayoutEffect(() => {
    const input = inputRef.current;
    const saved = selection.current;
    if (!input || !saved || document.activeElement !== input) return;
    input.setSelectionRange(saved[0], saved[1]);
    selection.current = null;
  }, [visible]);

  // The meter is announced once the typing settles, not on every key
  const [announced, setAnnounced] = React.useState("");
  React.useEffect(() => {
    if (!meter || !value) {
      setAnnounced("");
      return;
    }
    const timer = window.setTimeout(() => setAnnounced(`Password strength: ${strength.label}`), 700);
    return () => window.clearTimeout(timer);
  }, [meter, value, strength.label]);

  const toggle = () => {
    const input = inputRef.current;
    if (input) selection.current = [input.selectionStart ?? value.length, input.selectionEnd ?? value.length];
    setVisible((v) => !v);
  };

  const readCaps = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof event.getModifierState === "function") setCapsLock(event.getModifierState("CapsLock"));
  };

  const strengthId = `${id}-strength`;
  const rulesId = `${id}-rules`;
  const descriptionId = `${id}-description`;
  const capsId = `${id}-caps`;
  const describedBy = [
    description && descriptionId,
    meter && strengthId,
    rules.length > 0 && rulesId,
    capsLock && focused && capsId,
  ]
    .filter(Boolean)
    .join(" ");

  // Safari's password generator reads this attribute and makes a password the rules accept
  const passwordRules = usingDefaults && creating ? `minlength: ${minLength}; required: lower; required: upper; required: digit; required: special;` : undefined;
  const filled = value.length === 0 ? 0 : Math.max(1, strength.score);
  const invalid = touched && value.length > 0 && !valid;

  return (
    <div
      data-slot="field-password"
      data-valid={valid}
      data-disabled={disabled || undefined}
      className={cn("flex w-full flex-col gap-2", disabled && "opacity-60", className)}
      style={{ "--field-ease": SPRING_EASE } as React.CSSProperties}
    >
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground select-none">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={readCaps}
          onKeyUp={readCaps}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setTouched(true);
          }}
          autoComplete={autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          minLength={usingDefaults && creating ? minLength : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          {...(passwordRules ? { passwordrules: passwordRules } : {})}
          className={cn("font-medium tracking-wide", toneStyles[tone], sizeStyles[size].input, !visible && value && "tracking-[0.2em]")}
        />
        <button
          type="button"
          onClick={toggle}
          // Keeps the focus, and with it the caret, in the field when the eye is pressed with a pointer
          onPointerDown={(event) => {
            if (document.activeElement === inputRef.current) event.preventDefault();
          }}
          disabled={disabled}
          aria-pressed={visible}
          aria-controls={id}
          aria-label={visible ? "Hide password" : "Show password"}
          className={cn(
            "absolute inset-y-0 end-1 my-auto inline-flex cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors",
            "hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-not-allowed",
            sizeStyles[size].toggle,
          )}
        >
          <span className="relative inline-flex">
            <Eye
              aria-hidden="true"
              className={cn(
                "transition-[opacity,transform] duration-300 [transition-timing-function:var(--field-ease)] motion-reduce:transition-none",
                visible ? "scale-50 opacity-0" : "scale-100 opacity-100",
              )}
            />
            <EyeOff
              aria-hidden="true"
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-300 [transition-timing-function:var(--field-ease)] motion-reduce:transition-none",
                visible ? "scale-100 opacity-100" : "scale-50 opacity-0",
              )}
            />
          </span>
        </button>
      </div>

      {capsLock && focused && (
        <p id={capsId} className="flex items-center gap-1.5 text-sm text-amber-600 select-none dark:text-amber-400">
          <ArrowBigUp aria-hidden="true" className="size-4" />
          Caps Lock is on
        </p>
      )}

      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground select-none">
          {description}
        </p>
      )}

      {meter && (
        <div id={strengthId} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="grid flex-1 grid-cols-4 gap-1">
              {[0, 1, 2, 3].map((segment) => (
                <span key={segment} className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <span
                    className={cn(
                      "block h-full origin-left rounded-full transition-[transform,background-color] duration-500 [transition-timing-function:var(--field-ease)] motion-reduce:transition-none",
                      METER_COLORS[strength.score],
                    )}
                    style={{ transform: `scaleX(${segment < filled ? 1 : 0})`, transitionDelay: `${segment * 40}ms` }}
                  />
                </span>
              ))}
            </div>
            <span className="min-w-20 text-end text-sm text-muted-foreground tabular-nums select-none">
              {value ? strength.label : "Strength"}
            </span>
          </div>
          {value && strength.feedback && <p className="text-sm text-muted-foreground select-none">{strength.feedback}</p>}
        </div>
      )}

      {rules.length > 0 && (
        <ul id={rulesId} aria-label="Password requirements" className="grid gap-1.5 sm:grid-cols-2">
          {results.map(({ rule, met }) => (
            <li
              key={rule.id}
              data-met={met}
              className="group/rule flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 select-none data-[met=true]:text-foreground"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  className="fill-transparent stroke-border transition-[fill,stroke] duration-300 group-data-[met=true]/rule:fill-emerald-500 group-data-[met=true]/rule:stroke-emerald-500"
                  strokeWidth="1.5"
                />
                <path
                  d="M4.75 8.25 7 10.5l4.25-4.75"
                  fill="none"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  className="stroke-white [stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-500 [transition-timing-function:var(--field-ease)] group-data-[met=true]/rule:[stroke-dashoffset:0] motion-reduce:transition-none"
                />
              </svg>
              <span>{rule.label}</span>
              <span className="sr-only">{met ? ", met" : ", not met yet"}</span>
            </li>
          ))}
        </ul>
      )}

      <span aria-live="polite" className="sr-only">
        {announced}
      </span>
    </div>
  );
}
