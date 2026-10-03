import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadCurriculum, loadLesson, loadLessonParams, loadNeighbors } from "@/infrastructure/composition/server";
import { LessonScreen } from "@/presentation/lesson-screen";
import { toMenu } from "@/presentation/menu";

export function generateStaticParams() {
  return loadLessonParams();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = loadLesson(slug);
  if (!lesson) return { title: "Missing lesson" };
  return { title: lesson.title, description: lesson.summary };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = loadLesson(slug);
  if (!lesson) notFound();
  const neighbors = loadNeighbors(slug);
  const menu = toMenu(loadCurriculum());

  return (
    <LessonScreen
      lesson={lesson}
      parts={menu}
      previous={neighbors.previous}
      next={neighbors.next}
    />
  );
}
