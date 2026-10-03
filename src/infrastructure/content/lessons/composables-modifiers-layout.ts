import type { Lesson } from "@/domain/lesson";

export const composablesModifiersLayout: Lesson = {
  id: "composables-modifiers-layout",
  slug: "composables-modifiers-layout",
  partId: "compose",
  order: 11,
  title: "Composables, modifiers, and layout",
  summary: "Functions that describe UI, and the modifier chain that places them.",
  minutes: 28,
  checkpoint: "You can write a composable column with text, padding, and a button, and explain why it is not an XML layout.",
  sections: [
    {
      id: "composable",
      heading: "A composable is a function",
      paragraphs: [
        "Jetpack Compose UI is a `@Composable` function. It does not return a view you keep. It describes the UI for the current state, and Compose decides what changed. You call other composables the way you call functions: `Text(\"Field Notes\")`, `Button(onClick = { }) { Text(\"Save\") }`.",
        "Naming is a convention with teeth. Composable functions that emit UI are `PascalCase`, like types. Functions that return a value and do not emit UI stay `camelCase`, even if they are `@Composable` (`rememberScrollState`). The compiler lets you break the convention. Code review should not.",
        "Composables must be called from other composables, in the same order on every call. Do not call `Text` from inside an ordinary `if` that sometimes runs before another composable and sometimes after, in a way that changes the call order. Conditionals are fine when the branch clearly adds or removes a child. Loops of composables are fine when the list is stable. Side effects, navigation, and network calls do not belong in the body. Those have their own lesson.",
      ],
      code: {
        source: `@Composable
fun NoteHeader(title: String, onBack: () -> Unit) {
    Row {
        Button(onClick = onBack) { Text("Back") }
        Text(text = title)
    }
}`,
      },
    },
    {
      id: "modifiers",
      heading: "Modifiers are the layout arguments",
      paragraphs: [
        "A `Modifier` is an ordered chain of behavior: padding, size, click, background, test tags. Order matters. `padding` then `background` pads outside the color. `background` then `padding` colors the padding too. Read the chain from the outside in, as it is applied.",
        "The first parameter of a reusable composable should be `modifier: Modifier = Modifier`, and you should pass it to the root layout inside. Callers then position your component without you exposing twenty padding parameters. Hoist the modifier. Do not create a new one and ignore the argument.",
        "`Column`, `Row`, and `Box` are the layouts you need first. `Column` stacks vertically. `Row` stacks horizontally. `Box` stacks in Z order, which is how a label sits on a card. `verticalArrangement` and `horizontalAlignment` replace a pile of nested paddings. Reach for `LazyColumn` only when the list can grow. A `Column` of three texts is the right tool for three texts.",
      ],
      code: {
        source: `@Composable
fun NoteCard(title: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
    ) {
        Text(text = title, style = MaterialTheme.typography.titleMedium)
    }
}`,
      },
      callouts: [
        {
          level: "beginner",
          title: "dp and sp",
          body: "`16.dp` is a density-independent size. Text styles from Material already use scalable pixels. Do not hardcode font sizes in sp on every Text if a Material style already says what the text is.",
        },
      ],
    },
    {
      id: "preview",
      heading: "Previews are how you look without installing",
      paragraphs: [
        "`@Preview` draws a composable in Android Studio. The function cannot take parameters unless you supply defaults, because the preview has nothing to pass. Make a private preview function that calls your real composable with sample data.",
        "Previews do not run `ViewModel` code and do not have a real `Context` unless you ask. If a composable needs a click handler, pass an empty lambda. If it needs state, pass a `Success` value. That pressure is useful: a composable that can only be shown by constructing a ViewModel is hard to preview and hard to test.",
      ],
    },
  ],
  exercise: {
    prompt: "Write `@Composable fun EmptyNotes(onCreate: () -> Unit, modifier: Modifier = Modifier)` that shows the sentence \"No notes yet\" and a button labeled \"Create\", stacked in a `Column` with 24.dp of padding. Apply `modifier` to the column.",
    solution: `@Composable
fun EmptyNotes(onCreate: () -> Unit, modifier: Modifier = Modifier) {
    Column(modifier = modifier.padding(24.dp)) {
        Text("No notes yet")
        Button(onClick = onCreate) {
            Text("Create")
        }
    }
}`,
  },
  quiz: [
    {
      id: "order",
      prompt: "What is true of modifier order?",
      choices: [
        "Order does not matter",
        "Padding and background apply in the order you write them",
        "Only the first modifier is used",
        "Modifiers must be alphabetical",
      ],
      answerIndex: 1,
      explanation: "Each modifier wraps the next. padding then background is visually different from background then padding.",
    },
    {
      id: "param",
      prompt: "Where should a reusable composable accept a Modifier?",
      choices: [
        "As the first parameter, defaulting to Modifier",
        "Only as the last parameter, with no default",
        "Inside a companion object",
        "It should create its own and ignore the caller",
      ],
      answerIndex: 0,
      explanation: "modifier is the first parameter so callers can set position, and the default lets simple call sites omit it.",
    },
    {
      id: "side",
      prompt: "Which work does not belong directly in a composable body?",
      choices: [
        "Calling Text",
        "Calling Column",
        "Starting a network request",
        "Reading a String parameter",
      ],
      answerIndex: 2,
      explanation: "Composition should be free of side effects. Network calls belong in a coroutine started from an effect or a ViewModel.",
    },
  ],
  sources: [
    { title: "Compose documentation", url: "https://developer.android.com/develop/ui/compose/documentation" },
    { title: "Modifiers", url: "https://developer.android.com/develop/ui/compose/modifiers" },
    { title: "Layouts", url: "https://developer.android.com/develop/ui/compose/layouts/basics" },
    { title: "Kotlin for Compose", url: "https://developer.android.com/develop/ui/compose/kotlin" },
    { title: "Android Basics with Compose", url: "https://developer.android.com/courses/android-basics-compose/course" },
  ],
};
