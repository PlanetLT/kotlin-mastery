import type { Lesson } from "@/domain/lesson";

export const dataClasses: Lesson = {
  id: "data-classes",
  slug: "data-classes",
  partId: "model",
  order: 8,
  title: "Data classes",
  summary: "API models that compare by value, copy with one field changed, and destructure.",
  minutes: 20,
  checkpoint: "You can model a note from JSON-shaped fields, copy it with a new title, and say what equals compares.",
  sections: [
    {
      id: "data",
      heading: "data class writes the boring methods",
      paragraphs: [
        "A `data class` is a class whose main job is to hold values. The compiler generates `equals`, `hashCode`, `toString`, and `copy` from the properties in the primary constructor. Two notes with the same id and title are equal. Two ordinary classes are equal only if they are the same instance, unless you write `equals` yourself.",
        "That is what you want for an API payload and for UI state. A list diff, a set of selected ids, and a log line all depend on value equality and a readable `toString`. You would not mark an Android `Activity` as a data class. It is not a bag of values.",
        "Properties declared in the class body are not part of `equals` or `copy`. If a field matters to identity, put it in the primary constructor. If it is a cache, keep it out.",
      ],
      code: {
        source: `data class Note(
    val id: String,
    val title: String,
    val body: String,
)`,
      },
    },
    {
      id: "copy",
      heading: "copy changes one field and keeps the rest",
      paragraphs: [
        "State updates should produce a new value, not poke fields on the old one. `note.copy(title = \"Renamed\")` returns a new `Note` with the same id and body. The original is unchanged, so a Compose snapshot can see that the state object was replaced.",
        "Destructuring pulls constructor properties out by position: `val (id, title) = note`. It is convenient and also a little dangerous, because reordering constructor parameters silently changes what `title` means. Prefer named access in code that is read more than it is written. Destructuring shines in a lambda over pairs, not in a 12-field response.",
        "Data classes cannot be open. They are final. If you need a family of types, you want a sealed interface whose members are data classes, which is the next lesson. A single data class with a nullable `error: String?` and a nullable `notes: List<Note>?` is how screens end up showing an error and a list at the same time.",
      ],
      code: {
        source: `val saved = Note(id = "1", title = "Milk", body = "")
val renamed = saved.copy(title = "Oat milk")`,
      },
      callouts: [
        {
          level: "pro",
          title: "copy is shallow",
          body: "copy duplicates the references, not a deep graph. If a property is a mutable list and you mutate that list, both the old and new data class see the change. Keep the list immutable, or copy the list too: note.copy(tags = note.tags + \"later\").",
        },
      ],
    },
  ],
  exercise: {
    prompt: "Declare `data class Profile(val id: String, val displayName: String)`. Write `fun rename(profile: Profile, name: String): Profile` that returns a copy with a trimmed name, or the original profile if the trimmed name is blank.",
    solution: `data class Profile(val id: String, val displayName: String)

fun rename(profile: Profile, name: String): Profile {
    val trimmed = name.trim()
    if (trimmed.isEmpty()) return profile
    return profile.copy(displayName = trimmed)
}`,
  },
  quiz: [
    {
      id: "equals",
      prompt: "Two instances of a data class are equal when...",
      choices: [
        "They are the same object in memory",
        "Their primary-constructor properties are equal",
        "Their class names match",
        "toString returns the same text, including body properties",
      ],
      answerIndex: 1,
      explanation: "Generated equals and hashCode use the primary constructor properties only.",
    },
    {
      id: "copy",
      prompt: "What does note.copy(title = \"New\") do to the original note?",
      choices: [
        "Changes its title in place",
        "Leaves it unchanged and returns a new instance",
        "Deletes it",
        "Makes title a var",
      ],
      answerIndex: 1,
      explanation: "copy returns a new instance. The receiver is not mutated.",
    },
    {
      id: "open",
      prompt: "Can a data class be open for inheritance?",
      choices: [
        "Yes, that is how Loading and Success share a parent",
        "No. Use a sealed type whose branches are data classes",
        "Only if it has one property",
        "Only on Kotlin Multiplatform",
      ],
      answerIndex: 1,
      explanation: "Data classes are final. A sealed interface or sealed class is the hierarchy. Its branches can be data classes.",
    },
  ],
  sources: [
    { title: "Data classes", url: "https://kotlinlang.org/docs/data-classes.html" },
    { title: "Kotlin for Jetpack Compose: destructuring", url: "https://developer.android.com/develop/ui/compose/kotlin" },
    { title: "UI layer", url: "https://developer.android.com/topic/architecture/ui-layer" },
  ],
};
