export type GradedQuestion = {
  id: string;
  answerIndex: number;
};

export type QuizAnswerMap = Readonly<Record<string, number>>;

export type QuestionResult = {
  questionId: string;
  correct: boolean;
  answered: boolean;
};

export type QuizGrade = {
  correct: number;
  total: number;
  perfect: boolean;
  complete: boolean;
  results: readonly QuestionResult[];
};

export function gradeQuiz(
  questions: readonly GradedQuestion[],
  answers: QuizAnswerMap,
): QuizGrade {
  const results = questions.map((question) => {
    const selected = answers[question.id];
    const answered = selected !== undefined;
    return {
      questionId: question.id,
      answered,
      correct: answered && selected === question.answerIndex,
    };
  });
  const correct = results.filter((result) => result.correct).length;
  const total = questions.length;
  const complete = results.every((result) => result.answered);
  return {
    correct,
    total,
    perfect: total > 0 && correct === total,
    complete,
    results,
  };
}
