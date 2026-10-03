import type { Lesson } from "@/domain/lesson";

export const valueClasses: Lesson = {
  id: "value-classes",
  slug: "value-classes",
  partId: "later",
  order: 18,
  title: "Value classes",
  summary: "A wrapper the compiler can erase, and why it is not how you make an app good.",
  minutes: 16,
  checkpoint: "You can declare a value class, name two cases where it still boxes, and say why you waited.",
  sections: [
    {
      id: "what",
      heading: "A value class is a single property with a name",
      paragraphs: [
        "A `@JvmInline value class NoteId(val raw: String)` gives you a type that is not `String`. You cannot pass a title where an id is required. At runtime, when the compiler can see the use, the wrapper disappears and the value is the underlying `String`. You get the type safety without allocating an object on the hot path.",
        "The class must have exactly one parameter in the primary constructor, and that parameter is the underlying property. You can add functions. You cannot add more fields. `init` can check the value, but a check that throws still runs.",
        "This used to be called an inline class. The language keyword is now `value class`, with `@JvmInline` when you want the JVM representation erased. On Android you want that annotation. Without it you do not get the erasure you came for.",
      ],
      code: {
        source: `@JvmInline
value class NoteId(val raw: String)

fun open(id: NoteId) {
    println(id.raw)
}`,
      },
    },
    {
      id: "box",
      heading: "Sometimes it boxes anyway",
      paragraphs: [
        "The wrapper is allocated when the value is used as a nullable `NoteId?`, when it is cast to an interface, or when it is passed as a generic type argument that the compiler cannot specialize. A `List<NoteId>` is the classic surprise. You paid for a type and still allocated, because generics on the JVM erase to objects.",
        "Equality is by the underlying value. `NoteId(\"1\") == NoteId(\"1\")` is true. That is what you want for ids. It is a bad surprise if you thought the class gave you identity equality.",
        "None of this makes a screen faster by itself. A notes app spends its time on I/O, recomposition of huge rows, and images. Wrapping ids is a correctness tool you consider when a `String` mix-up is a real bug, or when a profiler says the allocation matters. Doing it in week one adds annotations and boxing puzzles before you have a list.",
      ],
      callouts: [
        {
          level: "pro",
          title: "Measure the allocation you think you removed",
          body: "If NoteId only ever lives in a List or in StateFlow's generic value, look at the bytecode or a memory trace before you claim it is free. The language spec lists the boxing cases. Your call sites decide which ones you hit.",
        },
      ],
    },
  ],
  exercise: {
    prompt: "Declare `@JvmInline value class Minutes(val amount: Int)` with a function `fun label(): String` that returns `\"$amount min\"`. Call it from `main` only if `amount` is non-negative in `init`. Do not use this type in a generic list for the exercise.",
    solution: `@JvmInline
value class Minutes(val amount: Int) {
    init {
        require(amount >= 0)
    }

    fun label(): String = "$amount min"
}

fun main() {
    println(Minutes(5).label())
}`,
  },
  quiz: [
    {
      id: "one",
      prompt: "How many properties can a value class store?",
      choices: ["Any number", "Exactly one, in the primary constructor", "Two, if one is private", "None"],
      answerIndex: 1,
      explanation: "A value class wraps exactly one underlying property.",
    },
    {
      id: "list",
      prompt: "When does a value class often still allocate?",
      choices: [
        "When used as a non-null local that the compiler can unbox",
        "When stored as a generic type argument such as List<NoteId>",
        "Never, that is the guarantee",
        "Only in composables named Text",
      ],
      answerIndex: 1,
      explanation: "Generics erase to objects, so the wrapper is boxed. Nullability and interface casts box as well.",
    },
    {
      id: "early",
      prompt: "Why is this a later topic?",
      choices: [
        "Value classes do not compile for Android",
        "They rarely improve an early app more than correct state, lists, and threading do",
        "They replace coroutines",
        "The BOM forbids them",
      ],
      answerIndex: 1,
      explanation: "Value classes are a targeted optimization and a type-safety tool. They are not the thing that makes the first screen good.",
    },
  ],
  sources: [
    { title: "Value classes", url: "https://kotlinlang.org/docs/inline-classes.html" },
    { title: "Inline value classes KEEP", url: "https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md" },
  ],
};
