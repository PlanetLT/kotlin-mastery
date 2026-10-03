import type { Lesson } from "@/domain/lesson";

export const stateHoistingRecomposition: Lesson = {
  id: "state-hoisting-recomposition",
  slug: "state-hoisting-recomposition",
  partId: "compose",
  order: 12,
  title: "State, hoisting, and recomposition",
  summary: "remember, mutableStateOf, and moving state to the caller that owns it.",
  minutes: 26,
  checkpoint: "You can hoist a text field's state so a parent holds the string and the child only emits events.",
  sections: [
    {
      id: "remember",
      heading: "Composition forgets unless you remember",
      paragraphs: [
        "A composable can run again at any time. A local `var text = \"\"` is recreated on every pass and the keystrokes disappear. `remember { mutableStateOf(\"\") }` stores the value in the composition and tells Compose to come back when it changes.",
        "`var text by remember { mutableStateOf(\"\") }` uses a property delegate so you read and write `text` instead of `text.value`. The `by` keyword is the one from Kotlin's delegated properties. You need the imports Compose's starter usually adds: `getValue` and `setValue`.",
        "`rememberSaveable` also survives process death and configuration change for values that can be saved in a Bundle: strings, numbers, and types you teach it to save. A text field's draft belongs there. A network response does not. That belongs in a ViewModel, which outlives the composition for a different reason.",
      ],
      code: {
        source: `@Composable
fun DraftField() {
    var text by rememberSaveable { mutableStateOf("") }
    TextField(value = text, onValueChange = { text = it }, label = { Text("Note") })
}`,
      },
    },
    {
      id: "hoist",
      heading: "Hoist state to the owner",
      paragraphs: [
        "State hoisting means the child does not own the source of truth. It receives the current value and an event: `title: String`, `onTitleChange: (String) -> Unit`. The parent, or a ViewModel the parent reads, decides what happens. The child can be previewed with `title = \"Milk\"` and an empty lambda.",
        "Hoist when more than one composable needs the value, when you need to persist it, or when the logic is more than a local animation. Leave state local when it is an implementation detail, such as whether a menu is expanded and nobody else cares.",
        "A practical pattern is a stateless `NoteEditor(state, onEvent)` and a stateful wrapper that remembers or collects from a ViewModel. Screens in production are almost always the wrapper plus the stateless content. Tests call the stateless one.",
      ],
      code: {
        source: `@Composable
fun NoteTitle(title: String, onTitleChange: (String) -> Unit) {
    TextField(value = title, onValueChange = onTitleChange)
}`,
      },
      callouts: [
        {
          level: "working",
          title: "Unidirectional data flow",
          body: "State flows down. Events flow up. The child does not reach into the parent to mutate a list. This is the same idea as a sealed UI state: one owner, one direction, no hidden writes.",
        },
      ],
    },
    {
      id: "recompose",
      heading: "Recomposition is a new call, not a new screen",
      paragraphs: [
        "When state changes, Compose calls the composables that read it again. It compares the result with the previous composition and updates only what changed. Your function must be safe to run often. It must not append to a list, write a file, or navigate during composition.",
        "Reading a state object subscribes the composable that read it. If a huge parent reads one counter, the parent restarts. Pass the counter into a small child so the parent does not have to read it. You will push this further in the stability lesson.",
        "`key` in a loop tells Compose which child is which when the list reorders. Without a stable key, Compose matches by position and animations and local state jump to the wrong row.",
      ],
    },
  ],
  exercise: {
    prompt: "Rewrite a composable that remembers its own query so the state is hoisted. Provide `SearchBar(query: String, onQueryChange: (String) -> Unit)` and a parent `SearchScreen` that holds the query with `rememberSaveable`.",
    solution: `@Composable
fun SearchScreen() {
    var query by rememberSaveable { mutableStateOf("") }
    SearchBar(query = query, onQueryChange = { query = it })
}

@Composable
fun SearchBar(query: String, onQueryChange: (String) -> Unit, modifier: Modifier = Modifier) {
    TextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier,
        label = { Text("Search") },
    )
}`,
  },
  quiz: [
    {
      id: "remember",
      prompt: "Why does a plain var inside a composable lose keystrokes?",
      choices: [
        "var is illegal in Kotlin",
        "The composable is called again and the local variable starts over",
        "TextField cannot display strings",
        "remember only works in XML",
      ],
      answerIndex: 1,
      explanation: "Recomposition calls the function again. remember stores the value across those calls.",
    },
    {
      id: "hoist",
      prompt: "What does a hoisted child receive?",
      choices: [
        "A ViewModel it constructs itself",
        "The current value and a callback for events",
        "Only a Modifier",
        "A mutable list it can edit",
      ],
      answerIndex: 1,
      explanation: "State down, events up. The child does not own the source of truth.",
    },
    {
      id: "effect",
      prompt: "Which action is unsafe during composition?",
      choices: [
        "Reading a String state",
        "Calling Text",
        "Navigating to another screen",
        "Passing a lambda to a child",
      ],
      answerIndex: 2,
      explanation: "Navigation is a side effect. Composition may run many times. Effects and event handlers are the places for that work.",
    },
  ],
  sources: [
    { title: "State and Jetpack Compose", url: "https://developer.android.com/develop/ui/compose/state" },
    { title: "Unidirectional data flow", url: "https://developer.android.com/develop/ui/compose/architecture" },
    { title: "Save UI state", url: "https://developer.android.com/develop/ui/compose/state#state-persistence" },
  ],
};
