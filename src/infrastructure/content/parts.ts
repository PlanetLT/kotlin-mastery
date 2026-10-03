import type { PartMeta } from "@/domain/lesson";

export const parts: readonly PartMeta[] = [
  {
    id: "start",
    title: "Start here",
    summary: "Who this guide is for, what to install, and what to postpone.",
  },
  {
    id: "jvm",
    title: "Kotlin on the JVM",
    summary: "The language every Android app is written in, from types through generics.",
  },
  {
    id: "objects",
    title: "Objects and companions",
    summary: "Single instances and constants, the small pattern you will see every week.",
  },
  {
    id: "model",
    title: "Model the screen",
    summary: "Data classes for payloads, sealed types for Loading, Success, and Error.",
  },
  {
    id: "gradle",
    title: "Gradle, as the build breaks",
    summary: "Read build.gradle.kts well enough to add a library and fix the usual failures.",
  },
  {
    id: "compose",
    title: "Jetpack Compose",
    summary: "The UI toolkit new Android screens are written in.",
  },
  {
    id: "async",
    title: "Coroutines and Flow",
    summary: "Load data, call APIs, and update the screen without freezing it.",
  },
  {
    id: "later",
    title: "Later, on purpose",
    summary: "Value classes after you measure. Multiplatform only when iOS must share the logic.",
  },
];
