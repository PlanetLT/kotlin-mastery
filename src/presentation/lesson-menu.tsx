"use client";

import Link from "next/link";
import { useGuideProgress } from "@/presentation/progress-provider";
import type { MenuPart } from "@/presentation/menu";
import { cn } from "@/shared/ui";

export function LessonMenu({
  parts,
  currentId,
  onNavigate,
}: {
  parts: readonly MenuPart[];
  currentId?: string;
  onNavigate?: () => void;
}) {
  const progress = useGuideProgress();

  return (
    <nav aria-label="Lessons" className="flex flex-col gap-6">
      {parts.map((part) => (
        <div key={part.id}>
          <p className="font-sans text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {part.title}
          </p>
          <ol className="mt-2 flex flex-col">
            {part.lessons.map((lesson) => {
              const current = lesson.id === currentId;
              const done = progress.complete(lesson.id);
              return (
                <li key={lesson.id}>
                  <Link
                    href={lesson.href}
                    onClick={onNavigate}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex items-baseline gap-2 rounded-md px-2 py-1.5 text-sm leading-snug hover:bg-muted",
                      current ? "bg-muted text-foreground" : "text-foreground/80",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "mt-1 size-1.5 shrink-0 rounded-full",
                        done ? "bg-primary" : "bg-border",
                      )}
                    />
                    <span>{lesson.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </nav>
  );
}
