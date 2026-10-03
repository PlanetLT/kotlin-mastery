import type { QuizAnswerMap, QuizGrade } from "@/domain/quiz";
import { gradeQuiz, type GradedQuestion } from "@/domain/quiz";

export function gradeLessonQuiz(
  questions: readonly GradedQuestion[],
  answers: QuizAnswerMap,
): QuizGrade {
  return gradeQuiz(questions, answers);
}
