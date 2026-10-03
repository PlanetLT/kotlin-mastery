import type { Lesson } from "@/domain/lesson";

export const flowAndUiUpdates: Lesson = {
  id: "flow-and-ui-updates",
  slug: "flow-and-ui-updates",
  partId: "async",
  order: 16,
  title: "Flow, StateFlow, and the screen",
  summary: "Cold streams, hot UI state, and collecting without freezing or leaking.",
  minutes: 32,
  checkpoint: "You can expose StateFlow from a ViewModel, update it from a suspend load, and collect it in Compose.",
  sections: [
    {
      id: "cold",
      heading: "Flow is cold until someone collects",
      paragraphs: [
        "A `Flow` is a sequence of values computed over time. Building the flow does not start the work. Collecting it does. Each collector typically starts the work again. That is what cold means. `repository.notes(): Flow<List<Note>>` backed by Room is cold: the query runs for the collector, and it stops when the collector cancels.",
        "`flow { emit(api.fetchNotes()) }` is a one-shot wrapped as a flow. That is legal and often worse than a suspend function. Use a suspend function for one response. Use a flow when values continue: a database query, a timer, a location.",
        "Operators transform flows. `map` changes each value. `catch` handles upstream exceptions. `flatMapLatest` switches to a new inner flow and cancels the previous one, which is what search should do when the query changes. The previous request must not paint over the newer one.",
      ],
      code: {
        source: `fun search(queries: Flow<String>): Flow<List<Note>> {
    return queries
        .debounce(300)
        .flatMapLatest { query -> repository.search(query) }
}`,
      },
    },
    {
      id: "state",
      heading: "StateFlow is the UI's current value",
      paragraphs: [
        "`StateFlow` is hot. It always has a value, and collectors receive the current one immediately. A ViewModel holds `MutableStateFlow(NotesUiState.Loading)` privately and exposes `StateFlow` through `asStateFlow()`. The UI never sees the mutable type, so it cannot write.",
        "Update with `update { current -> ... }` when the next state depends on the previous one. Assignment (`value = NotesUiState.Success(notes)`) is fine when you replace the whole state. Do not mutate a list stored inside the current value. Emit a new sealed state.",
        "`SharedFlow` is for events that are not state: a one-off snackbar, a navigation command. It does not keep a current value the way `StateFlow` does. New screens sometimes misuse it for state and then miss the last value. If the screen needs \"what is showing now\", it is `StateFlow`. If the screen needs \"this happened\", it is a `SharedFlow` or, simpler, a channel consumed once.",
      ],
      code: {
        source: `class NotesViewModel(
    private val repository: NoteRepository,
) : ViewModel() {
    private val _state = MutableStateFlow<NotesUiState>(NotesUiState.Loading)
    val state: StateFlow<NotesUiState> = _state.asStateFlow()

    fun refresh() {
        viewModelScope.launch {
            _state.value = NotesUiState.Loading
            _state.value = try {
                NotesUiState.Success(repository.loadNotes())
            } catch (cancelled: CancellationException) {
                throw cancelled
            } catch (error: IOException) {
                NotesUiState.Error(error.message ?: "Offline")
            }
        }
    }
}`,
      },
      callouts: [
        {
          level: "pro",
          title: "conflate and buffer",
          body: "A slow collector can fall behind. conflate keeps the latest value and drops intermediates, which is right for UI state. buffer queues. StateFlow already conflates: collectors see the latest state, not every intermediate assignment they were too slow to read.",
        },
      ],
    },
    {
      id: "collect",
      heading: "Collect in Compose with lifecycle awareness",
      paragraphs: [
        "`val state by viewModel.state.collectAsStateWithLifecycle()` collects while the UI is at least started and stops when it is stopped. That avoids wasted work when the app is backgrounded. `collectAsState()` does not know about the Android lifecycle. Prefer the lifecycle variant in app screens.",
        "The `by` delegate unwraps the `State` so `state` in the composable is the `NotesUiState` itself. You then `when (state)` as you already know how to do. The ViewModel is obtained with `viewModel()`, and the composable's job is to send events (`onRetry = viewModel::refresh`) and draw the state.",
        "Do not collect a cold flow in composition with `LaunchedEffect` and a remembered `var` if `collectAsStateWithLifecycle` can do it. Manual collection is how you forget to cancel. Collect in the ViewModel when you need to turn a cold repository flow into `StateFlow` for the screen: `repository.notes().map { NotesUiState.Success(it) }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), NotesUiState.Loading)`.",
      ],
    },
  ],
  exercise: {
    prompt: "A search box emits queries. You have `suspend fun NoteRepository.search(query: String): List<Note>`. Write a function that returns `Flow<List<Note>>`, waits 300 milliseconds of quiet, cancels the previous search when the query changes, and calls the repository. You may use `flow { emit(repository.search(query)) }` as the inner flow.",
    solution: `fun results(queries: Flow<String>, repository: NoteRepository): Flow<List<Note>> {
    return queries
        .debounce(300)
        .map { it.trim() }
        .distinctUntilChanged()
        .flatMapLatest { query ->
            flow { emit(repository.search(query)) }
        }
}`,
  },
  quiz: [
    {
      id: "cold",
      prompt: "When does a cold Flow start its work?",
      choices: [
        "When the flow { } builder runs",
        "When a collector collects it",
        "When the class is loaded",
        "When you call asStateFlow",
      ],
      answerIndex: 1,
      explanation: "Cold flows run for each collector. Creating the Flow value does not start the upstream.",
    },
    {
      id: "stateflow",
      prompt: "Why expose StateFlow from a ViewModel for screen state?",
      choices: [
        "It has no current value, so the UI stays empty until the next event",
        "It always has a current value, and the UI cannot mutate the private MutableStateFlow",
        "It replaces sealed classes",
        "It runs on Dispatchers.IO by default",
      ],
      answerIndex: 1,
      explanation: "StateFlow holds the latest UI state. Exposing it as StateFlow keeps writes inside the ViewModel.",
    },
    {
      id: "latest",
      prompt: "What does flatMapLatest do when a new query arrives?",
      choices: [
        "Runs both searches and shows whichever finishes last",
        "Cancels the previous inner flow and collects the new one",
        "Ignores the new query",
        "Blocks the main thread for 300 milliseconds",
      ],
      answerIndex: 1,
      explanation: "flatMapLatest switches to the newest inner flow and cancels the previous collection, so stale searches do not win.",
    },
  ],
  sources: [
    { title: "Flow", url: "https://kotlinlang.org/docs/flow.html" },
    { title: "Kotlin flows on Android", url: "https://developer.android.com/kotlin/flow" },
    { title: "StateFlow and SharedFlow", url: "https://developer.android.com/kotlin/flow#stateflow" },
    { title: "collectAsStateWithLifecycle", url: "https://developer.android.com/develop/ui/compose/state#lifecycle-aware" },
    { title: "ViewModel", url: "https://developer.android.com/topic/libraries/architecture/viewmodel" },
  ],
};
