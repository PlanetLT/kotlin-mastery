import type { Lesson } from "@/domain/lesson";

export const classesAndProperties: Lesson = {
  id: "classes-and-properties",
  slug: "classes-and-properties",
  partId: "jvm",
  order: 4,
  title: "Classes and properties",
  summary: "State on a type, constructors, visibility, and custom getters.",
  minutes: 24,
  checkpoint: "You can model a Note with a primary constructor, keep a setter private, and add a derived property.",
  sections: [
    {
      id: "class",
      heading: "A class is state plus operations",
      paragraphs: [
        "A Kotlin class lists its constructor parameters in the header. `val` or `var` on a parameter makes it a property. Without that keyword, the parameter exists only long enough for `init` or a property initializer to use it.",
        "Properties are not Java fields with handwritten getters. `note.title` might be a field, a computed value, or a getter you wrote. Callers do not care, which is why you can later change storage without changing every screen.",
        "Android framework types (`Activity`, `ViewModel`, `Application`) are classes you extend. Your own screen models usually should not form a deep inheritance tree. Composition, and later sealed hierarchies for state, stay easier to change.",
      ],
      code: {
        source: `class Note(
    val id: Long,
    var title: String,
    private var draft: Boolean = true,
) {
    val isPublished: Boolean
        get() = !draft

    fun publish() {
        draft = false
    }
}`,
      },
    },
    {
      id: "visibility",
      heading: "Visibility is how you keep a screen honest",
      paragraphs: [
        "The modifiers are `public` (the default), `internal` (visible inside the same Gradle module), `protected` (class and subclasses), and `private` (the file or the class). `internal` is the one Java does not have. It is the right default for types that no other module should construct.",
        "A public `val` with a private setter is the usual shape for state that the owner updates and everyone else reads: `var query: String = \"\" private set`. You will see this on a `ViewModel` before you move to `StateFlow`.",
        "Put types that change together in the same file when they are small. Kotlin does not force one class per file. A note and its validation function can sit beside each other.",
      ],
      callouts: [
        {
          level: "beginner",
          title: "init is not a second constructor",
          body: "The init block runs when the instance is created, after the primary constructor parameters exist. Use it for checks, such as requiring a non-blank id. Prefer a factory function when construction has several successful shapes.",
        },
      ],
    },
    {
      id: "backing",
      heading: "Custom getters and the backing field",
      paragraphs: [
        "A property with only a getter and no initializer has no field. `val isPublished get() = !draft` is computed every read. A property that stores a value and also customizes access uses `field` inside the accessor. That word is the backing field. You cannot say `title = title` in a setter without looping.",
        "Do not hide expensive work in a getter. A getter that reads the network or walks a huge list will surprise a Compose recomposition, because reading state during composition is supposed to be cheap. Derived text is fine. I/O is not.",
      ],
      code: {
        source: `class Counter {
    var count: Int = 0
        private set

    fun increment() {
        count += 1
    }
}`,
      },
    },
  ],
  exercise: {
    prompt: "Create `class Notebook(val owner: String) { ... }` that keeps a private `MutableList` of titles, exposes `val size: Int`, and has `fun add(title: String)` that ignores a blank title. Callers must not be able to clear the list from outside.",
    solution: `class Notebook(val owner: String) {
    private val titles = mutableListOf<String>()

    val size: Int
        get() = titles.size

    fun add(title: String) {
        val trimmed = title.trim()
        if (trimmed.isEmpty()) return
        titles += trimmed
    }
}`,
  },
  quiz: [
    {
      id: "property",
      prompt: "In class Note(val id: Long, title: String), which names are properties?",
      choices: [
        "Both id and title",
        "Only id",
        "Only title",
        "Neither, until you write get()",
      ],
      answerIndex: 1,
      explanation: "val or var on a constructor parameter declares a property. title here is only a constructor parameter.",
    },
    {
      id: "internal",
      prompt: "What does internal mean?",
      choices: [
        "Visible to subclasses only",
        "Visible inside the same Gradle module",
        "Visible inside the same function",
        "Hidden from Kotlin, visible to Java",
      ],
      answerIndex: 1,
      explanation: "internal visibility is module-wide. private is the class or file. protected is the class hierarchy.",
    },
    {
      id: "getter-io",
      prompt: "Why should a property getter avoid network calls?",
      choices: [
        "Getters cannot use suspend",
        "Reading a property looks cheap, and Compose may read it often during composition",
        "The JVM forbids I/O in getters",
        "StateFlow cannot expose a getter",
      ],
      answerIndex: 1,
      explanation: "Callers, including recomposition, assume property reads are cheap. Suspend functions and repositories are where I/O belongs. A getter also cannot be a suspend function.",
    },
  ],
  sources: [
    { title: "Classes", url: "https://kotlinlang.org/docs/classes.html" },
    { title: "Properties", url: "https://kotlinlang.org/docs/properties.html" },
    { title: "Visibility modifiers", url: "https://kotlinlang.org/docs/visibility-modifiers.html" },
  ],
};
