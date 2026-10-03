import type { Lesson } from "@/domain/lesson";

export const nullSafetyAndControlFlow: Lesson = {
  id: "null-safety-and-control-flow",
  slug: "null-safety-and-control-flow",
  partId: "jvm",
  order: 3,
  title: "Null safety and control flow",
  summary: "Types that include null, and the branches you will use in UI state.",
  minutes: 22,
  checkpoint: "You can read a nullable title without crashing, and you can choose a branch with if and when.",
  sections: [
    {
      id: "null",
      heading: "Null is part of the type",
      paragraphs: [
        "`String` cannot hold null. `String?` can. The question mark is the feature people mean when they say Kotlin is null-safe. The compiler refuses `title.length` when `title` is a `String?`, because that call is a crash if the value is absent.",
        "Three tools cover almost every case. `?.` calls a method only when the receiver is non-null, and otherwise produces null. `?:` supplies a fallback. `!!` asserts non-null and throws if you were wrong. Use the first two. Treat `!!` as a bug unless you are at a boundary you just checked and a comment says why the compiler cannot see it.",
        "The Elvis operator is how a screen turns a missing name into a placeholder. Do that at the edge, then pass a non-null `String` into the rest of the UI. The deeper the `?` travels, the more every function has to repeat the same check.",
      ],
      code: {
        source: `fun displayName(raw: String?): String {
    val trimmed = raw?.trim()
    return if (trimmed.isNullOrBlank()) "Untitled" else trimmed
}`,
      },
    },
    {
      id: "if-when",
      heading: "if and when are expressions",
      paragraphs: [
        "`if` returns a value, so you can write `val label = if (pinned) \"Pinned\" else title`. `when` does the same for several branches. Prefer `when` once you have three or more cases, and prefer it always when the subject is a sealed type. The compiler can then tell you that a new case was not handled.",
        "A `when` without an `else` is only legal when the subject is an enum, a sealed type, or a boolean and every possibility is listed. That is the point. An `else` that shows a generic error hides new states. You will lean on this in the sealed-class lesson.",
        "Smart casts are why `if (note != null)` lets you call `note.title` inside the branch. The compiler narrows the type. Smart casts fail if the value is a `var` that another thread, or a custom getter, could change. Local `val` bindings keep the cast.",
      ],
      code: {
        source: `fun statusLabel(code: Int): String = when (code) {
    200 -> "Saved"
    404 -> "Missing"
    in 500..599 -> "Server"
    else -> "Unexpected"
}`,
      },
      callouts: [
        {
          level: "working",
          title: "Ranges and in",
          body: "`in 500..599` is an ordinary when branch. `!in` and `is` are the other checks you will use. `is` both tests the type and smart-casts.",
        },
      ],
    },
    {
      id: "loops",
      heading: "Loops you will actually write",
      paragraphs: [
        "`for (note in notes)` walks a collection. `for (index in notes.indices)` walks positions when you need the index, which is rarer in Compose because `itemsIndexed` exists for lists. `while` is for a condition that is not a collection, such as draining a queue.",
        "Prefer a collection operation (`map`, `filter`) when you are transforming data, and a `for` loop when you are performing a sequence of effects. On a screen, transformation belongs in the state object. Effects belong in a coroutine, which is several lessons away.",
      ],
    },
  ],
  exercise: {
    prompt: "Write `fun preview(body: String?, max: Int = 40): String`. If `body` is null or blank, return `\"No text\"`. Otherwise trim it and, if it is longer than `max`, return the prefix plus an ellipsis character.",
    solution: `fun preview(body: String?, max: Int = 40): String {
    val trimmed = body?.trim()
    if (trimmed.isNullOrBlank()) return "No text"
    if (trimmed.length <= max) return trimmed
    return trimmed.take(max).trimEnd() + "…"
}`,
  },
  quiz: [
    {
      id: "string-q",
      prompt: "Which declaration can store null?",
      choices: ["val name: String", "val name: String?", "val name = \"\"", "lateinit var name: String"],
      answerIndex: 1,
      explanation: "The ? on the type is what allows null. An empty string is a real string, and lateinit is a non-null var that crashes if read too early.",
    },
    {
      id: "bang",
      prompt: "What does title!! do when title is null?",
      choices: [
        "Returns an empty string",
        "Skips the call and returns null",
        "Throws a NullPointerException",
        "Smart-casts title to String for the rest of the file",
      ],
      answerIndex: 2,
      explanation: "!! is an assertion. A null receiver throws. Use ?. and ?: instead.",
    },
    {
      id: "when-else",
      prompt: "When can a when expression omit else?",
      choices: [
        "Whenever you are tired of typing",
        "When the subject is sealed, an enum, or Boolean and every case is listed",
        "Only inside a composable",
        "Only when the subject is a String",
      ],
      answerIndex: 1,
      explanation: "The compiler allows a missing else only when it can see that the branches are exhaustive.",
    },
  ],
  sources: [
    { title: "Null safety", url: "https://kotlinlang.org/docs/null-safety.html" },
    { title: "Control flow", url: "https://kotlinlang.org/docs/control-flow.html" },
    { title: "Conditions and loops", url: "https://kotlinlang.org/docs/control-flow.html" },
  ],
};
