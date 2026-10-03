import { emptyProgress, markLessonRead, recordQuizResult, type ProgressState } from "@/domain/progress";
import type { QuizGrade } from "@/domain/quiz";

export function applyLessonRead(state: ProgressState, lessonId: string): ProgressState {
  return markLessonRead(state, lessonId);
}

export function applyQuizResult(
  state: ProgressState,
  lessonId: string,
  grade: Pick<QuizGrade, "correct" | "total" | "perfect">,
): ProgressState {
  return recordQuizResult(state, lessonId, grade);
}

export function applyProgressReset(): ProgressState {
  return emptyProgress;
}
