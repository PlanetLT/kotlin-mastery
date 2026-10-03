import type { Lesson } from "@/domain/lesson";

export const objectsAndCompanions: Lesson = {
  id: "objects-and-companions",
  slug: "objects-and-companions",
  partId: "objects",
  order: 7,
  title: "Objects and companion objects",
  summary: "One instance, constants, and factories, without hiding a second ViewModel.",
  minutes: 18,
  checkpoint: "You can declare a companion constant, write a factory on a companion, and say why a ViewModel should not be an object.",
  sections: [
    {
      id: "object",
      heading: "object declares a single instance",
      paragraphs: [
        "`object Analytics` declares a type and its only instance at once. There is no constructor call. Kotlin creates the instance lazily, on first use, in a thread-safe way. That is a singleton.",
        "Singletons are a poor home for anything that needs a `Context`, a repository, or a test double. They are a good home for stateless helpers and for a sealed branch that carries no data (`object Idle : ScreenState`). You will use the second form constantly.",
        "An object can implement an interface. `object Empty : NoteRepository` can be a fake in a preview or a test. It should not be the production repository if the production one needs a database.",
      ],
      code: {
        source: `object TimeFormat {
    fun formatMinutes(minutes: Int): String = "$minutes min"
}`,
      },
    },
    {
      id: "companion",
      heading: "companion object is the type's object",
      paragraphs: [
        "A `companion object` sits inside a class. Its members are called on the type name: `Note.MAX_TITLE`. From Java they are `Note.Companion` unless you add `@JvmStatic` or a `const`.",
        "`const val` is a compile-time constant. It has to be a `String` or a primitive, and it belongs at the top level or inside an object. Use it for keys and limits that never change. A regular `val` inside the companion can be a more interesting object, created when the companion is first touched.",
        "Factories belong on the companion when there are several ways to build a valid instance and the constructor should stay private or boring. `Note.create(title)` can trim and reject blanks, then call the constructor. That is a small pattern. It is not a service locator.",
      ],
      code: {
        source: `class Note private constructor(val title: String) {
    companion object {
        const val MAX_TITLE = 80

        fun create(raw: String): Note? {
            val title = raw.trim()
            if (title.isEmpty() || title.length > MAX_TITLE) return null
            return Note(title)
        }
    }
}`,
      },
      callouts: [
        {
          level: "working",
          title: "Do not store a ViewModel in a companion",
          body: "A ViewModel has a lifecycle tied to a screen. Android creates and clears it. An object or companion lives for the process. Putting a ViewModel there leaks the screen and breaks rotation, tests, and process death. Constants and pure functions are the companion's job.",
        },
      ],
    },
  ],
  exercise: {
    prompt: "Add a companion to `class Route(val path: String)` with `const val HOME = \"home\"` and `fun home(): Route`. The constructor can stay public. Call `Route.home()` from a `main` function.",
    solution: `class Route(val path: String) {
    companion object {
        const val HOME = "home"

        fun home(): Route = Route(HOME)
    }
}

fun main() {
    val route = Route.home()
    println(route.path)
}`,
  },
  quiz: [
    {
      id: "singleton",
      prompt: "How many instances does an object declaration have?",
      choices: ["Zero until you call a constructor", "One", "One per thread", "One per Activity"],
      answerIndex: 1,
      explanation: "An object declaration is a singleton. Kotlin creates it on first access.",
    },
    {
      id: "const",
      prompt: "Where is const val legal?",
      choices: [
        "On any class property",
        "Only at the top level or inside an object, for a String or primitive",
        "Only inside a composable",
        "Only on a data class",
      ],
      answerIndex: 1,
      explanation: "const val must be a compile-time constant of a primitive or String, declared at file level or in an object.",
    },
    {
      id: "vm",
      prompt: "Why is an object a bad place for a ViewModel?",
      choices: [
        "Objects cannot have functions",
        "A ViewModel must follow the screen lifecycle, and an object lives for the process",
        "ViewModels must be data classes",
        "Compose cannot read objects",
      ],
      answerIndex: 1,
      explanation: "Android owns ViewModel creation and clearing. A process-wide object outlives the screen and is the wrong owner.",
    },
  ],
  sources: [
    { title: "Object declarations", url: "https://kotlinlang.org/docs/object-declarations.html" },
    { title: "Companion objects", url: "https://kotlinlang.org/docs/object-declarations.html#companion-objects" },
    { title: "Kotlin coding conventions", url: "https://kotlinlang.org/docs/coding-conventions.html" },
  ],
};
