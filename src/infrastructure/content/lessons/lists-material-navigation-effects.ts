import type { Lesson } from "@/domain/lesson";

export const listsMaterialNavigationEffects: Lesson = {
  id: "lists-material-navigation-effects",
  slug: "lists-material-navigation-effects",
  partId: "compose",
  order: 13,
  title: "Lists, Material, navigation, and effects",
  summary: "Lazy lists, Material 3, routes between screens, and the side effects that are actually allowed.",
  minutes: 30,
  checkpoint: "You can show a lazy list, theme it with Material 3, navigate with a typed argument, and start a coroutine from a click.",
  sections: [
    {
      id: "lazy",
      heading: "LazyColumn composes what is visible",
      paragraphs: [
        "`LazyColumn` is the list. `items(notes, key = { it.id }) { note -> NoteRow(note) }` composes rows that are on screen, not the entire history of the notebook. The `key` must be stable and unique. Using the list index as a key breaks when you insert at the top.",
        "Do not put a `LazyColumn` inside another vertically scrolling `Column` without a bounded height. The lazy list wants a height constraint. Give it `Modifier.weight(1f)` inside a parent `Column`, or make it the root.",
        "Empty, loading, and error are not rows you sneak into the data list. They are branches of the sealed state. `Loading` shows a progress indicator. `Success` with an empty list shows your empty composable. `Success` with items shows the lazy list. `Error` shows the message and a retry button.",
      ],
      code: {
        source: `@Composable
fun NoteList(notes: List<Note>, onOpen: (String) -> Unit, modifier: Modifier = Modifier) {
    LazyColumn(modifier = modifier) {
        items(notes, key = { it.id }) { note ->
            NoteRow(note = note, onClick = { onOpen(note.id) })
        }
    }
}`,
      },
    },
    {
      id: "material",
      heading: "Material 3 is the default visual system",
      paragraphs: [
        "`MaterialTheme` provides color, type, and shapes. The Empty Activity template already wraps the screen in a theme. Use `MaterialTheme.colorScheme.primary` and `MaterialTheme.typography` instead of inventing a second palette in every file. `Button`, `TextField`, `Scaffold`, `TopAppBar`, and `FloatingActionButton` are the building blocks.",
        "`Scaffold` is the slot for a top bar, a floating button, and a snackbar host. Put the screen content in the `content` lambda and apply the `PaddingValues` it gives you. Ignoring that padding hides content behind the app bar.",
        "Accessibility is part of the widget, not a later coat of paint. Icons that are buttons need `contentDescription`. Decorative icons pass null. Touch targets should stay at least 48.dp. Do not encode state by color alone. A pinned note needs a word or an icon, not only a gold stripe.",
      ],
    },
    {
      id: "nav-effects",
      heading: "Navigation and the effects you may run",
      paragraphs: [
        "Navigation Compose builds a graph of routes. A route is a string or, in current Navigation, a serializable type. Navigate in the click handler: `onClick = { navController.navigate(NoteRoute(id)) }`. Do not navigate during composition, or a recomposition will push the same screen again.",
        "Arguments travel with the route. The detail composable receives `id: String` as a normal parameter after the navigation layer extracts it. The detail screen then loads that id. It does not reach back into the list's memory.",
        "`LaunchedEffect(key)` starts a coroutine when the key first enters composition, and cancels it when the key changes or the composable leaves. Use it for work tied to being on screen, such as scrolling to a newly created id. `rememberCoroutineScope()` gives you a scope for a click, such as `scope.launch { listState.animateScrollToItem(0) }`. A click is not composition, so the scope is the right tool. `LaunchedEffect` is the right tool when there is no click.",
        "`DisposableEffect` is for a subscription you must undo. If you register a listener, unregister it in `onDispose`. Forgetting that is how a screen leaks the activity.",
      ],
      callouts: [
        {
          level: "pro",
          title: "rememberUpdatedState",
          body: "A LaunchedEffect that captures a lambda can keep the lambda from the first composition if the key does not change. rememberUpdatedState holds the latest lambda without restarting the effect. Use it when the effect should live for the screen but call the newest onTimeout.",
        },
      ],
    },
  ],
  exercise: {
    prompt: "Sketch `NotesBody(state: NotesUiState, onRetry: () -> Unit, onOpen: (String) -> Unit)`. Branch with `when`. `Loading` shows `CircularProgressIndicator`. `Error` shows the message and a retry button. `Success` shows `LazyColumn` keyed by id, or the text \"No notes yet\" when the list is empty.",
    solution: `@Composable
fun NotesBody(
    state: NotesUiState,
    onRetry: () -> Unit,
    onOpen: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    when (state) {
        NotesUiState.Loading -> CircularProgressIndicator(modifier = modifier)
        is NotesUiState.Error -> Column(modifier = modifier) {
            Text(state.message)
            Button(onClick = onRetry) { Text("Retry") }
        }
        is NotesUiState.Success -> if (state.notes.isEmpty()) {
            Text("No notes yet", modifier = modifier)
        } else {
            LazyColumn(modifier = modifier) {
                items(state.notes, key = { it.id }) { note ->
                    Text(text = note.title, modifier = Modifier.clickable { onOpen(note.id) })
                }
            }
        }
    }
}`,
  },
  quiz: [
    {
      id: "key",
      prompt: "What should a LazyColumn item key be?",
      choices: [
        "The item index",
        "A stable unique id from the data",
        "The title, even when titles repeat",
        "Always 0",
      ],
      answerIndex: 1,
      explanation: "Keys identify items across reorder and insert. The index changes. Duplicate titles collide.",
    },
    {
      id: "navigate",
      prompt: "When should you call navController.navigate?",
      choices: [
        "Directly in the composable body",
        "In an event handler such as onClick",
        "Inside a property getter",
        "Inside equals of a data class",
      ],
      answerIndex: 1,
      explanation: "Navigation is a side effect. The body can recompose many times. A click happens once per tap.",
    },
    {
      id: "launched",
      prompt: "What does LaunchedEffect do when its key changes?",
      choices: [
        "Nothing",
        "Cancels the previous coroutine and starts a new one",
        "Leaks the old coroutine on purpose",
        "Blocks the main thread until the block returns",
      ],
      answerIndex: 1,
      explanation: "The effect is tied to the key. A new key cancels the old job and launches again. Leaving composition cancels it too.",
    },
  ],
  sources: [
    { title: "Lists", url: "https://developer.android.com/develop/ui/compose/lists" },
    { title: "Material Design 3 in Compose", url: "https://developer.android.com/develop/ui/compose/designsystems/material3" },
    { title: "Navigation with Compose", url: "https://developer.android.com/develop/ui/compose/navigation" },
    { title: "Side effects", url: "https://developer.android.com/develop/ui/compose/side-effects" },
    { title: "Kotlin for Compose: coroutines", url: "https://developer.android.com/develop/ui/compose/kotlin" },
  ],
};
