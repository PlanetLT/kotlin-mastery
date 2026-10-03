import type { Lesson } from "@/domain/lesson";

export const extensionsAndGenerics: Lesson = {
  id: "extensions-and-generics",
  slug: "extensions-and-generics",
  partId: "jvm",
  order: 6,
  title: "Extensions and generics",
  summary: "Functions on types you do not own, and lists that remember what they hold.",
  minutes: 28,
  checkpoint: "You can add an extension on String, read List<Note> without casts, and explain in versus out in one sentence each.",
  sections: [
    {
      id: "extensions",
      heading: "Extensions are static calls with a receiver",
      paragraphs: [
        "An extension function looks like a method you added to someone else's class. `fun String.toNoteTitle(): String` is called as `\"milk\".toNoteTitle()`. The compiler rewrites it to a static function whose first parameter is the string. It does not actually change the `String` class, and a Java caller will see a static method.",
        "That limit matters. An extension cannot access private members. If a member with the same signature already exists, the member wins. Extensions are for formatting, small conversions, and Compose modifiers you will write later, not for sneaking behavior into a type you should have designed yourself.",
        "Keep extensions next to the feature that uses them, or in a file named for the type. A grab-bag `Extensions.kt` becomes a place where names collide.",
      ],
      code: {
        source: `fun String.asTitle(): String = trim().replaceFirstChar { char ->
    if (char.isLowerCase()) char.uppercase() else char.toString()
}`,
      },
    },
    {
      id: "generics",
      heading: "Generics keep the list honest",
      paragraphs: [
        "`List<Note>` means every element is a `Note`. You do not cast on the way out. `fun firstTitle(notes: List<Note>): String?` can call `notes.firstOrNull()?.title` because the type argument is known.",
        "A generic function introduces the type parameter before the name: `fun <T> List<T>.secondOrNull(): T? = if (size >= 2) this[1] else null`. The caller does not pass `T` when the compiler can infer it.",
        "`reified` is the pro tool. A normal type parameter is erased at runtime, so you cannot ask `item is T` inside an ordinary generic function. `inline fun <reified T> List<Any>.filterIsInstance(): List<T>` can, because the function is inlined and `T` is real at each call site. You will see this in the standard library. You rarely need to write it in app code.",
      ],
      callouts: [
        {
          level: "pro",
          title: "in and out",
          body: "`out T` (covariance) means the type only produces T, like `List<out T>`, so a `List<Heading>` can be used as a `List<Note>` if Heading is a Note... only when Heading is a subtype and the list is a producer. `in T` (contravariance) means the type only consumes T, like a comparison function that can accept a wider type. If you remember one rule: out goes out, in goes in. Mutable collections are invariant because they both produce and consume.",
        },
      ],
    },
    {
      id: "any",
      heading: "Any, Nothing, and Unit",
      paragraphs: [
        "`Any` is the top of the non-null type hierarchy. `Any?` includes null. Reaching for `Any` in app code usually means the model is unclear. A sealed interface is almost always a better parameter than `Any`.",
        "`Nothing` is the type of a function that never returns, such as one that always throws. `Unit` is the type of a function that returns with nothing useful to say. Confusing them leads to `TODO()`, whose return type is `Nothing`, being used as a placeholder that still type-checks in any branch.",
      ],
    },
  ],
  exercise: {
    prompt: "Write an extension `fun List<String>.titles(): String` that joins trimmed, non-blank items with a comma and a space. An empty result should return `\"None\"`. Then call it on `listOf(\" milk \", \"\", \"bread\")`.",
    solution: `fun List<String>.titles(): String {
    val cleaned = map { it.trim() }.filter { it.isNotEmpty() }
    if (cleaned.isEmpty()) return "None"
    return cleaned.joinToString(", ")
}

val label = listOf(" milk ", "", "bread").titles() // "milk, bread"`,
  },
  quiz: [
    {
      id: "ext-private",
      prompt: "Can an extension function read a private property of the receiver class?",
      choices: [
        "Yes, extensions are members",
        "No, they are compiled as static functions outside the class",
        "Only if the extension is marked inline",
        "Only from the same composable",
      ],
      answerIndex: 1,
      explanation: "Extensions do not receive special access. Private members stay private to the class.",
    },
    {
      id: "erasure",
      prompt: "Why does a normal generic function fail to check item is T?",
      choices: [
        "T is erased at runtime",
        "is is forbidden in Kotlin",
        "T must be an interface",
        "Only lists of strings support is",
      ],
      answerIndex: 0,
      explanation: "JVM generics are erased. reified on an inline function keeps the type at the call site.",
    },
    {
      id: "out",
      prompt: "What does out T declare?",
      choices: [
        "The type only consumes T",
        "The type only produces T",
        "T is nullable",
        "T is a primitive",
      ],
      answerIndex: 1,
      explanation: "out is covariance: the generic type produces T and does not accept T as an input. List is declared with out.",
    },
  ],
  sources: [
    { title: "Extensions", url: "https://kotlinlang.org/docs/extensions.html" },
    { title: "Generics", url: "https://kotlinlang.org/docs/generics.html" },
    { title: "Generic variance", url: "https://kotlinlang.org/docs/generics.html#variance" },
    { title: "Inline functions", url: "https://kotlinlang.org/docs/inline-functions.html" },
  ],
};
