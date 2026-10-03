import type { Lesson } from "@/domain/lesson";

export const collectionsLambdasAndScope: Lesson = {
  id: "collections-lambdas-and-scope",
  slug: "collections-lambdas-and-scope",
  partId: "jvm",
  order: 5,
  title: "Collections, lambdas, and scope functions",
  summary: "Lists you do not mutate by accident, and the five scope functions used narrowly.",
  minutes: 26,
  checkpoint: "You can filter and map a list of notes, and you can say which scope function you reached for and why.",
  sections: [
    {
      id: "lists",
      heading: "Read-only versus mutable",
      paragraphs: [
        "`listOf` returns a `List`, which has no `add`. `mutableListOf` returns a `MutableList`, which does. Function parameters should ask for `List` unless they truly need to mutate the collection. A `ViewModel` can keep a mutable list privately and expose `List` to the UI.",
        "`map` builds a new list by transforming each element. `filter` keeps elements that match. `firstOrNull` finds one or returns null, which fits the previous lesson better than `first`, which throws. These functions do not change the original list.",
        "A lambda is a function value. The implicit name for a single parameter is `it`. Name the parameter when the lambda is nested or when `it` would refer to the wrong receiver. Trailing lambdas let you write `notes.filter { it.pinned }` instead of passing the lambda inside the parentheses.",
      ],
      code: {
        source: `data class Note(val title: String, val pinned: Boolean)

fun pinnedTitles(notes: List<Note>): List<String> {
    return notes
        .filter { it.pinned }
        .map { it.title }
}`,
      },
    },
    {
      id: "scope",
      heading: "Scope functions, one job each",
      paragraphs: [
        "Kotlin's scope functions are easy to chain into noise. Use them for one job, and prefer an ordinary local variable when the chain needs a comment.",
        "`let` is for a nullable value you want to use only when it is present: `id?.let { repository.load(it) }`. The object is `it`, and the result is the lambda's result.",
        "`apply` configures a new object and returns that object. It shows up when building an Android `Intent` or a view in old code. Inside, `this` is the object. `also` is for a side effect that should not change the result, such as a log, and it returns the original object. `run` and `with` compute a result with the object as `this`. If you cannot explain the choice in those terms, write a local `val` instead.",
      ],
      code: {
        source: `fun loadTitle(rawId: String?): String? {
    return rawId?.trim()?.takeIf { it.isNotEmpty() }?.let { id ->
        "Note $id"
    }
}`,
      },
      callouts: [
        {
          level: "pro",
          title: "takeIf and takeUnless",
          body: "`takeIf { condition }` returns the receiver or null. It is a filter for one value. Combined with `?.let`, it replaces a nested if. It still returns null, so the caller must handle absence.",
        },
      ],
    },
    {
      id: "maps",
      heading: "Maps and sets",
      paragraphs: [
        "`mapOf(\"id\" to 1)` builds a read-only map. `to` is an infix function that creates a `Pair`. You will use maps for small lookup tables. For a screen's data, a list of data classes is usually clearer than a map of string keys, because the compiler can see the fields.",
        "`setOf` rejects duplicates by equality. That matters once your notes are data classes, because equality is then based on the properties. A `Set<Note>` with two equal notes keeps one.",
      ],
    },
  ],
  exercise: {
    prompt: "Given `val notes = listOf(\"Milk\", \" \", \"Bread\", \"Milk\")`, produce a `List<String>` of trimmed, non-blank titles with duplicates removed, preserving the first occurrence. Do it with collection operations, not a mutable loop.",
    solution: `val notes = listOf("Milk", " ", "Bread", "Milk")

val cleaned = notes
    .map { it.trim() }
    .filter { it.isNotEmpty() }
    .distinct()`,
  },
  quiz: [
    {
      id: "list-add",
      prompt: "Why does listOf(\"a\") not have a reliable add for callers?",
      choices: [
        "listOf returns List, whose public API does not include add",
        "The JVM cannot store strings",
        "add exists but only on the main thread",
        "listOf returns an Array",
      ],
      answerIndex: 0,
      explanation: "List is the read-only interface. MutableList is the one with add. Ask for List unless mutation is the point.",
    },
    {
      id: "let",
      prompt: "Which scope function is the usual choice for a nullable value you transform only when present?",
      choices: ["apply", "also", "let", "with"],
      answerIndex: 2,
      explanation: "let passes the receiver as it and returns the lambda result. Combined with ?., the block is skipped when the value is null.",
    },
    {
      id: "apply",
      prompt: "What does apply return?",
      choices: [
        "The lambda's last expression",
        "Unit",
        "The original receiver, after the lambda runs",
        "A copy of the receiver",
      ],
      answerIndex: 2,
      explanation: "apply returns the receiver. The lambda is for configuration. also also returns the receiver, but its lambda takes it and is meant for side effects.",
    },
  ],
  sources: [
    { title: "Collections overview", url: "https://kotlinlang.org/docs/collections-overview.html" },
    { title: "Lambdas", url: "https://kotlinlang.org/docs/lambdas.html" },
    { title: "Scope functions", url: "https://kotlinlang.org/docs/scope-functions.html" },
    { title: "Kotlin for Jetpack Compose", url: "https://developer.android.com/develop/ui/compose/kotlin" },
  ],
};
