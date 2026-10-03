export type Level = "beginner" | "working" | "pro";

export type Callout = {
  level: Level;
  title: string;
  body: string;
};

export type CodeSample = {
  caption?: string;
  source: string;
};

export type Section = {
  id: string;
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  code?: CodeSample;
  callouts?: readonly Callout[];
};

export type Exercise = {
  prompt: string;
  starter?: string;
  solution: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: readonly [string, string, string, string] | readonly string[];
  answerIndex: number;
  explanation: string;
};

export type SourceLink = {
  title: string;
  url: string;
};

export type Lesson = {
  id: string;
  slug: string;
  partId: string;
  order: number;
  title: string;
  summary: string;
  minutes: number;
  checkpoint: string;
  sections: readonly Section[];
  exercise: Exercise;
  quiz: readonly QuizQuestion[];
  sources: readonly SourceLink[];
};

export type PartMeta = {
  id: string;
  title: string;
  summary: string;
};

export type Part = PartMeta & {
  lessons: readonly Lesson[];
};

export type Curriculum = {
  parts: readonly Part[];
  lessons: readonly Lesson[];
};

export type LessonNeighbors = {
  previous?: Lesson;
  next?: Lesson;
};
