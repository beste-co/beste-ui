"use client";

import { Check, Copy, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TerminalCommand {
  id: string;
  prompt?: string;
  command: string;
  output?: string;
  outputDelay?: number;
}

interface Terminal1Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  terminal?: {
    title?: string;
    commands: TerminalCommand[];
    typeSpeed?: number;
    delayBetweenCommands?: number;
    showLineNumbers?: boolean;
  };
  showCopyButton?: boolean;
  glowEffect?: boolean;
  className?: string;
}

export const terminal1Demo: Terminal1Props = {
  badge: { label: "Quick Start", variant: "secondary" },
  heading: "Get started in seconds",
  description:
    "Install our CLI and start building. Just a few commands to get up and running.",
  terminal: {
    title: "Terminal",
    commands: [
      {
        id: "cmd-1",
        prompt: "$ ",
        command: "npm install -g @acme/cli",
        output: "Installing @acme/cli...\n✓ Installed successfully",
        outputDelay: 800,
      },
      {
        id: "cmd-2",
        prompt: "$ ",
        command: "acme init my-project",
        output: "Creating project structure...\n✓ Project initialized",
        outputDelay: 600,
      },
      {
        id: "cmd-3",
        prompt: "$ ",
        command: "cd my-project && acme dev",
        output:
          "Starting development server...\n✓ Ready at http://localhost:3000",
        outputDelay: 500,
      },
    ],
    typeSpeed: 50,
    delayBetweenCommands: 1000,
    showLineNumbers: false,
  },
  showCopyButton: true,
  glowEffect: true,
};

interface TypewriterState {
  commandIndex: number;
  charIndex: number;
  outputCharIndex: number;
  isTypingCommand: boolean;
  isTypingOutput: boolean;
  isComplete: boolean;
}

function useTerminalTypewriter(
  commands: TerminalCommand[],
  typeSpeed = 50,
  outputTypeSpeed = 10,
  delayBetweenCommands = 1000,
  isInView = true
) {
  const [state, setState] = useState<TypewriterState>({
    commandIndex: 0,
    charIndex: 0,
    outputCharIndex: 0,
    isTypingCommand: true,
    isTypingOutput: false,
    isComplete: false,
  });
  const [displayedCommands, setDisplayedCommands] = useState<
    Array<{ command: string; output: string; isComplete: boolean }>
  >([]);
  const [isStarted, setIsStarted] = useState(false);

  const reset = useCallback(() => {
    setState({
      commandIndex: 0,
      charIndex: 0,
      outputCharIndex: 0,
      isTypingCommand: true,
      isTypingOutput: false,
      isComplete: false,
    });
    setDisplayedCommands([]);
    setIsStarted(false);
  }, []);

  useEffect(() => {
    if (isInView && !isStarted) {
      setIsStarted(true);
    }
  }, [isInView, isStarted]);

  useEffect(() => {
    if (!isStarted || !commands || commands.length === 0 || state.isComplete)
      return;

    const currentCommand = commands[state.commandIndex];
    if (!currentCommand) return;

    // Typing command
    if (state.isTypingCommand) {
      if (state.charIndex < currentCommand.command.length) {
        const timeout = setTimeout(() => {
          setState((prev) => ({ ...prev, charIndex: prev.charIndex + 1 }));

          setDisplayedCommands((prev) => {
            const updated = [...prev];
            const existing = updated[state.commandIndex] || {
              command: "",
              output: "",
              isComplete: false,
            };
            updated[state.commandIndex] = {
              command: currentCommand.command.slice(0, state.charIndex + 1),
              output: existing.output,
              isComplete: false,
            };
            return updated;
          });
        }, typeSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Command finished, start output after delay
        const outputDelay = currentCommand.outputDelay ?? 500;
        const timeout = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isTypingCommand: false,
            isTypingOutput: !!currentCommand.output,
            outputCharIndex: 0,
          }));
        }, outputDelay);
        return () => clearTimeout(timeout);
      }
    }

    // Typing output
    if (state.isTypingOutput && currentCommand.output) {
      if (state.outputCharIndex < currentCommand.output.length) {
        const timeout = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            outputCharIndex: prev.outputCharIndex + 1,
          }));

          setDisplayedCommands((prev) => {
            const updated = [...prev];
            const existing = updated[state.commandIndex] || {
              command: "",
              output: "",
              isComplete: false,
            };
            updated[state.commandIndex] = {
              command: existing.command,
              output:
                currentCommand.output?.slice(0, state.outputCharIndex + 1) ||
                "",
              isComplete: false,
            };
            return updated;
          });
        }, outputTypeSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Output finished
        setDisplayedCommands((prev) => {
          const updated = [...prev];
          const existing = updated[state.commandIndex] || {
            command: "",
            output: "",
            isComplete: false,
          };
          updated[state.commandIndex] = {
            command: existing.command,
            output: currentCommand.output || "",
            isComplete: true,
          };
          return updated;
        });
        setState((prev) => ({ ...prev, isTypingOutput: false }));
      }
    }

    // Move to next command or finish
    if (!state.isTypingCommand && !state.isTypingOutput) {
      if (state.commandIndex < commands.length - 1) {
        const timeout = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            commandIndex: prev.commandIndex + 1,
            charIndex: 0,
            outputCharIndex: 0,
            isTypingCommand: true,
            isTypingOutput: false,
          }));
        }, delayBetweenCommands);
        return () => clearTimeout(timeout);
      } else {
        setState((prev) => ({ ...prev, isComplete: true }));
      }
    }
  }, [
    state,
    commands,
    typeSpeed,
    outputTypeSpeed,
    delayBetweenCommands,
    isStarted,
  ]);

  return {
    displayedCommands,
    currentCommandIndex: state.commandIndex,
    isTypingCommand: state.isTypingCommand && !state.isComplete,
    isTypingOutput: state.isTypingOutput && !state.isComplete,
    isComplete: state.isComplete,
    reset,
  };
}

const terminalTheme = {
  bg: "#09090b", // zinc-900
  border: "#3f3f46", // zinc-700
  header: "#27272a", // zinc-800
  headerText: "#a1a1aa", // zinc-400
  text: "#f4f4f5", // zinc-100
  prompt: "#34d399", // emerald-400
  output: "#a1a1aa", // zinc-400
  glow: "0 0 50px rgba(0,0,0,0.5)",
};

function useInView(
  ref: React.RefObject<HTMLElement | null>,
  options?: { amount?: number }
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: options?.amount ?? 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options?.amount]);

  return isInView;
}

export function Terminal1({
  badge,
  heading,
  description,
  terminal,
  showCopyButton = true,
  glowEffect = true,
  className,
}: Terminal1Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const [copied, setCopied] = useState(false);

  const {
    displayedCommands,
    isTypingCommand,
    isTypingOutput,
    isComplete,
    reset,
  } = useTerminalTypewriter(
    terminal?.commands || [],
    terminal?.typeSpeed || 50,
    15,
    terminal?.delayBetweenCommands || 1000,
    isInView
  );

  const handleCopy = useCallback(() => {
    const allCommands = terminal?.commands
      .map((cmd) => `${cmd.prompt || "$ "}${cmd.command}`)
      .join("\n");

    if (allCommands) {
      navigator.clipboard.writeText(allCommands);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [terminal?.commands]);

  const handleRestart = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex gap-4 items-center justify-center flex-col">
          {badge && (
            <div>
              <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
            </div>
          )}

          {heading && (
            <h2 className="text-2xl md:text-4xl text-center font-semibold">
              {heading}
            </h2>
          )}

          {description && (
            <p className="text-base md:text-lg text-balance text-center max-w-3xl text-muted-foreground">
              {description}
            </p>
          )}

          <div ref={containerRef} className="w-full mt-8">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: terminalTheme.bg,
                border: `1px solid ${terminalTheme.border}`,
                boxShadow: glowEffect ? terminalTheme.glow : undefined,
              }}
            >
              {/* Header with 3-column grid for centered title */}
              <div
                className="grid grid-cols-3 items-center px-4 py-3"
                style={{ backgroundColor: terminalTheme.header }}
              >
                {/* Left: Window controls */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>

                {/* Center: Title (always centered) */}
                <span
                  className="text-sm font-medium text-center"
                  style={{ color: terminalTheme.headerText }}
                >
                  {terminal?.title || "Terminal"}
                </span>

                {/* Right: Action buttons */}
                <div className="flex items-center gap-2 justify-end">
                  {showCopyButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      className="w-6 h-6 rounded-md transition-colors hover:bg-white/10"
                      style={{ color: terminalTheme.headerText }}
                      title="Copy commands"
                    >
                      {copied ? (
                        <Check className="size-4 text-emerald-400" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  )}
                  {isComplete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRestart}
                      className="w-6 h-6 rounded-md transition-colors hover:bg-white/10"
                      style={{ color: terminalTheme.headerText }}
                      title="Restart animation"
                    >
                      <RotateCcw className="size-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-4 md:p-6 font-mono text-sm md:text-base min-h-[200px]">
                {displayedCommands.map((item, index) => {
                  const command = terminal?.commands[index];
                  const isCurrentCommand =
                    index === displayedCommands.length - 1;
                  return (
                    <div key={command?.id || index} className="mb-3 last:mb-0">
                      <div className="flex items-start gap-2">
                        {terminal?.showLineNumbers && (
                          <span
                            className="select-none w-6 text-right"
                            style={{ color: terminalTheme.output }}
                          >
                            {index + 1}
                          </span>
                        )}
                        <span
                          className="font-semibold"
                          style={{ color: terminalTheme.prompt }}
                        >
                          {command?.prompt || "$ "}
                        </span>
                        <span style={{ color: terminalTheme.text }}>
                          {item.command}
                          {isCurrentCommand && isTypingCommand && (
                            <span className="animate-pulse">|</span>
                          )}
                        </span>
                      </div>
                      {item.output && (
                        <div
                          className={cn(
                            "mt-1 whitespace-pre-wrap",
                            terminal?.showLineNumbers && "ml-8"
                          )}
                          style={{ color: terminalTheme.output }}
                        >
                          {item.output}
                          {isCurrentCommand && isTypingOutput && (
                            <span className="animate-pulse">|</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {displayedCommands.length === 0 && (
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold"
                      style={{ color: terminalTheme.prompt }}
                    >
                      {terminal?.commands[0]?.prompt || "$ "}
                    </span>
                    <span
                      className="animate-pulse"
                      style={{ color: terminalTheme.text }}
                    >
                      |
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
