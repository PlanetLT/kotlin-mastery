import type { QuizGrade } from "./quiz";

export type QuizScore = {
  correct: number;
  total: number;
};

export type ProgressState = {
  completedLessonIds: readonly string[];
  quizScores: Readonly<Record<string, QuizScore>>;
};

export const emptyProgress: ProgressState = {
  completedLessonIds: [],
  quizScores: {},
};

export type PathStatus = "empty" | "in-progress" | "finished";

export function isLessonComplete(state: ProgressState, lessonId: string): boolean {
  return state.completedLessonIds.includes(lessonId);
}

export function completedCount(state: ProgressState, lessonIds: readonly string[]): number {
  return lessonIds.filter((id) => isLessonComplete(state, id)).length;
}

export function pathStatus(done: number, total: number): PathStatus {
  if (done <= 0) return "empty";
  if (total > 0 && done >= total) return "finished";
  return "in-progress";
}

function withCompleted(state: ProgressState, lessonId: string): ProgressState {
  if (isLessonComplete(state, lessonId)) return state;
  return {
    ...state,
    completedLessonIds: [...state.completedLessonIds, lessonId],
  };
}

export function markLessonRead(state: ProgressState, lessonId: string): ProgressState {
  return withCompleted(state, lessonId);
}

export function recordQuizResult(
  state: ProgressState,
  lessonId: string,
  grade: Pick<QuizGrade, "correct" | "total" | "perfect">,
): ProgressState {
  const next: ProgressState = {
    ...state,
    quizScores: {
      ...state.quizScores,
      [lessonId]: { correct: grade.correct, total: grade.total },
    },
  };
  return grade.perfect ? withCompleted(next, lessonId) : next;
}
