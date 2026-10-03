"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { getProgressStore } from "@/infrastructure/composition/browser";
import { applyLessonRead, applyProgressReset, applyQuizResult } from "@/application/progress-actions";
import {
  completedCount,
  emptyProgress,
  isLessonComplete,
  pathStatus,
  type PathStatus,
  type ProgressState,
} from "@/domain/progress";
import type { QuizGrade } from "@/domain/quiz";

type ProgressApi = {
  state: ProgressState;
  done: (lessonIds: readonly string[]) => number;
  status: (lessonIds: readonly string[]) => PathStatus;
  complete: (lessonId: string) => boolean;
  markRead: (lessonId: string) => void;
  saveQuiz: (lessonId: string, grade: Pick<QuizGrade, "correct" | "total" | "perfect">) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressApi | null>(null);

function serverProgress(): ProgressState {
  return emptyProgress;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const store = getProgressStore();
  const state = useSyncExternalStore(store.subscribe, store.read, serverProgress);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      done: (lessonIds) => completedCount(state, lessonIds),
      status: (lessonIds) => pathStatus(completedCount(state, lessonIds), lessonIds.length),
      complete: (lessonId) => isLessonComplete(state, lessonId),
      markRead: (lessonId) => store.write(applyLessonRead(state, lessonId)),
      saveQuiz: (lessonId, grade) => store.write(applyQuizResult(state, lessonId, grade)),
      reset: () => store.write(applyProgressReset()),
    }),
    [state, store],
  );

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useGuideProgress(): ProgressApi {
  const api = useContext(ProgressContext);
  if (!api) throw new Error("useGuideProgress must be used inside ProgressProvider");
  return api;
}
