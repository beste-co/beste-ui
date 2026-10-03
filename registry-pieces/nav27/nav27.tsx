"use client";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Workspace {
  name: string;
  initials: string;
  imageSrc?: string;
  alt?: string;
}

interface Nav27Props {
  current?: Workspace;
  workspaces?: Workspace[];
  open?: boolean;
  bordered?: boolean;
  className?: string;
}

export const nav27Demo: Nav27Props = {
  current: {
    name: "Figma",
    initials: "FG",
    imageSrc: "https://oud.pics/sm/l/figma.png",
    alt: "Figma",
  },
  workspaces: [
    {
      name: "Figma",
      initials: "FG",
      imageSrc: "https://oud.pics/sm/l/figma.png",
      alt: "Figma",
    },
    {
      name: "Notion",
      initials: "NO",
      imageSrc: "https://oud.pics/sm/l/notion.png",
      alt: "Notion",
    },
    {
      name: "Dropbox",
      initials: "DB",
      imageSrc: "https://oud.pics/sm/l/dropbox.png",
      alt: "Dropbox",
    },
  ],
  open: true,
  bordered: false,
};

function WorkspaceAvatar({
  workspace,
  size,
}: {
  workspace: Workspace;
  size: number;
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md text-xs font-semibold text-white",
        !workspace.imageSrc &&
          "bg-gradient-to-br from-sky-500 to-indigo-500"
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {workspace.imageSrc ? (
        <img
          src={workspace.imageSrc}
          alt={workspace.alt ?? workspace.name}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        workspace.initials
      )}
    </div>
  );
}

export function Nav27({
  current,
  workspaces = [],
  open = false,
  bordered = false,
  className,
}: Nav27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-56 flex-col gap-1">
        <button
          type="button"
          className={cn("flex items-center gap-2 rounded-md bg-card px-2 py-2 shadow-sm", bordered && "border border-border")}
        >
          {current && <WorkspaceAvatar workspace={current} size={28} />}
          <span className="flex-1 truncate text-left text-sm font-semibold text-card-foreground">
            {current?.name}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
        {open && (
          <div className={cn("flex flex-col gap-0.5 rounded-md bg-card p-1 shadow-md", bordered && "border border-border")}>
            {workspaces.map((w, idx) => (
              <button
                key={idx}
                type="button"
                className={cn(
                  "flex items-center gap-2 rounded px-2 py-1.5 text-sm",
                  w.name === current?.name
                    ? "bg-muted font-semibold text-card-foreground"
                    : "text-card-foreground hover:bg-muted/60"
                )}
              >
                <WorkspaceAvatar workspace={w} size={24} />
                <span className="flex-1 truncate text-left">{w.name}</span>
              </button>
            ))}
            <span
              className="mx-1 my-1 h-px bg-border"
              aria-hidden="true"
            />
            <button
              type="button"
              className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/60 hover:text-card-foreground"
            >
              New workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
