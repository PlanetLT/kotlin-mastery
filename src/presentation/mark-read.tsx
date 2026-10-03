"use client";

import { useGuideProgress } from "@/presentation/progress-provider";
import { Button } from "@/shared/ui";

export function MarkRead({ lessonId }: { lessonId: string }) {
  const progress = useGuideProgress();
  const done = progress.complete(lessonId);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant={done ? "secondary" : "outline"}
        className="font-mono"
        disabled={done}
        onClick={() => progress.markRead(lessonId)}
      >
        {done ? "Marked complete" : "Mark as read"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Use this when you already know the lesson. A perfect quiz marks it too.
      </p>
    </div>
  );
}
