---
title: Composer
category: Component Patterns
layer: components/
composedWith: compound-component, provider
---

## Composer

A Composer reads a small context **contract** and renders — it knows nothing about where the data came from. One or more **source Providers** fill that contract and are interchangeable behind the same shape. Top of the composition ladder: reach for it only when a concrete pain shows up (see below).

Naming carries the role: `*Composer` consumes a contract; `*Provider` is an interchangeable source; a plain name (`NotesBlock`) is a props component with no hidden context.

### Constraints

- **The contract is a tiny context** — `createContext<T | null>(null)` plus a `useX()` hook that throws when `null` (same shape as `provider`). Two payload shapes; take only the slices you need:
  - `{ state, meta }` — data plus source-dependent presentation knobs. Use for swappable/deferred sources.
  - `{ state, actions }` — lifted state plus its actions. Use when state must cross a component boundary.
- **The Composer never fetches or owns state.** A source Provider is the only place that touches the data layer. A Composer with a single source and no alternative in sight is just a `pure-component` in a costume.
- **Always ship a fixture source Provider** next to the real one — props-seeded, no network, a first-class source and the test seam. Mirrors `src/test-lib/TestAuthProvider.tsx`, which fills the same production context from fixtures.
- **A source Provider wraps what the feature already uses** (a query hook, `use-case-hook`, or XState actor) — it does not reimplement state.
- **Placement:** contract + Composer under the feature's UI layer; context-provider components in `application/`, never the `providers/` directory (that's the React-Query data layer).

### When to climb — and when not to

Climb when one piece of UI must render **swappable/deferred** sources, when you want a **fixture source for tests**, or when state must **cross a boundary** (callbacks drilled to a leaf). Do **not** climb for uniformity, a single source with no alternative, or state that never leaves its component.

### Example — `{ state, meta }` (swappable + fixture sources)

```tsx
// quotes-context.ts — the contract
export const QuotesContext = createContext<QuotesContextValue | null>(null);
type QuotesContextValue = {
  state: { quotes: readonly QuoteSummary[] };
  meta: { emptyLabel: string; showStatusBadge: boolean };
};
export const useQuotes = (): QuotesContextValue => {
  const ctx = use(QuotesContext);
  if (ctx === null)
    throw new Error("useQuotes must be used within a QuotesProvider");
  return ctx;
};
```

```tsx
// QuotesListComposer.tsx — reads the contract, composes Item (compound-component). No source knowledge.
export const QuotesListComposer = () => {
  const {
    state: { quotes },
    meta: { emptyLabel, showStatusBadge },
  } = useQuotes();
  if (quotes.length === 0) return <Text>{emptyLabel}</Text>;
  return (
    <Item.Group>
      {quotes.map((quote) => (
        <Item.Root key={quote.id} render={<Link to={`/quotes/${quote.id}`} />}>
          <Item.Content>
            <Item.Title>{quote.name}</Item.Title>
          </Item.Content>
          {showStatusBadge ? (
            <Item.Actions>
              <Badge>{quote.status}</Badge>
            </Item.Actions>
          ) : null}
        </Item.Root>
      ))}
    </Item.Group>
  );
};
```

```tsx
// Real source wraps the query hook; fixture source takes props — same contract, interchangeable.
export const ActiveQuotesProvider = ({ children }: PropsWithChildren) => (
  <QuotesContext.Provider
    value={{
      state: { quotes: useActiveQuotes() },
      meta: { emptyLabel: "No active quotes", showStatusBadge: true },
    }}
  >
    {children}
  </QuotesContext.Provider>
);

export const FixtureQuotesProvider = ({
  quotes = [],
  emptyLabel = "No quotes",
  showStatusBadge = true,
  children,
}: FixtureProps) => (
  <QuotesContext.Provider
    value={{ state: { quotes }, meta: { emptyLabel, showStatusBadge } }}
  >
    {children}
  </QuotesContext.Provider>
);
```

Swapping the source is swapping the provider; deferring is a `Suspense` wrap; testing is rendering the Composer inside `FixtureQuotesProvider`:

```tsx
<ActiveQuotesProvider>
  <QuotesListComposer />
</ActiveQuotesProvider>
// vs. lazy: <Suspense fallback={<Skeleton />}><ArchivedQuotesProvider><QuotesListComposer /></ArchivedQuotesProvider></Suspense>
// vs. test: <FixtureQuotesProvider quotes={[]} emptyLabel="No archived quotes"><QuotesListComposer /></FixtureQuotesProvider>
```

### Example — `{ state, actions }` (lifted state, provider is the boundary)

Same mechanism; the contract carries `actions` instead of `meta`. The provider owns the state, so every layer between it and the leaf drops a callback prop — and a sibling outside the subtree can drive the same state:

```tsx
type NotesContextValue = {
  state: { notes: Note[] };
  actions: {
    addNote: (c: string) => void;
    deleteNote: (n: Note) => void; /* … */
  };
};

// The leaf reads the contract — no callbacks in its signature
const NoteBlockComposer = ({ note }: { note: Note }) => {
  const { actions } = useNotes();
  return <Button onClick={() => actions.deleteNote(note)}>Delete</Button>;
};

// A sibling OUTSIDE the notes subtree drives the same state — boundary is the provider, not the layout
const AddNoteButtonComposer = () => {
  const { actions } = useNotes();
  return <Button onClick={() => actions.addNote("")}>Add note</Button>;
};
// The NotesProvider wraps the feature's data layer (useNotesApi) and exposes plain actions.
```

### References

- `rules/compound-component.md` — the markup a Composer composes (rung 2)
- `rules/provider.md` — a source Provider is a specialization of the DI-thin provider
- `rules/pure-component.md` — stay here until a second source appears
