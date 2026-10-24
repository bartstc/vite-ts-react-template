# Building Blocks Skill (bundled)

> Frontend building block catalog — typed patterns for components, hooks, queries, mutations, stores, and models. ALWAYS read the relevant rule file before creating or modifying any building block in src/features/ or src/lib/. This includes spec implementation (read rule files for every block in the Building Blocks Diff), new feature work, refactoring, and architectural decisions.

---

# SKILL

# Frontend Building Blocks

Typed catalog of building blocks used in this project. Each block has a fixed name, layer, composition rules, and canonical example.

## How to Use

Read the rule file for each block you are about to implement. The summaries below are for routing — the rule files contain the full pattern.

## Composition ladder

Composition is a ladder. Default to the bottom rung; climb only when a concrete, named pain appears. Each rung buys flexibility and costs indirection.

| Rung | Block                | Reach for it when…                                                                                        |
| ---- | -------------------- | --------------------------------------------------------------------------------------------------------- |
| 1    | `pure-component`     | default — reusable UI is a function of its props.                                                         |
| 2    | `compound-component` | a component grows a prop per shape, or callers need a layout the props did not anticipate.                |
| 3    | `composer`           | one piece of UI must render data from swappable/deferred sources, or you want a fixture source for tests. |
| 4    | `composer`           | state must cross a component boundary (callbacks drilled to a leaf) and the layout should stay pure.      |

Do not climb for uniformity, for a single source with no alternative in sight, or for state that never leaves its component.

## Block Catalog

### Data Fetching

| Block                      | Layer      | Summary                                                                                                                           | File                                |
| -------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `mutation-options-factory` | `lib/api/` | Reusable `mutationOptions()` factories with domain error translation. Composed by `mutation-hook` in `queries/`.                  | `rules/mutation-options-factory.md` |
| `mutation-hook`            | `queries/` | Server write via `useMutation` composed from `mutation-options-factory`, with cache invalidation. Returns `[handler, isPending]`. | `rules/mutation-hook.md`            |
| `query-options-factory`    | `lib/api/` | Reusable `queryOptions()` factories — no hooks, no `useQuery`. Hook composition belongs in `queries/`.                            | `rules/query-options-factory.md`    |
| `query-keys-factory`       | `lib/api/` | Hierarchical `as const` key tuples per resource. Single source of truth for cache invalidation.                                   | `rules/query-keys-factory.md`       |
| `dto-model`                | `lib/api/` | TypeScript interfaces mirroring the raw API wire format. No transformations.                                                      | `rules/dto-model.md`                |

### State Management

| Block      | Layer          | Summary                                                                                                                                                                | File                |
| ---------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `store`    | `application/` | Zustand store — small, focused, selector-only subscriptions. Actions live inside the store.                                                                            | `rules/store.md`    |
| `machine`  | `application/` | XState machine for multi-step async flows. Discriminated-union context; actors wrap the slice's own queries; typed `ErrorActorEvent` rejections; emits events outward. | `rules/machine.md`  |
| `provider` | `queries/`     | Thin React Context wrapper for dependency injection. No logic — delivers state, doesn't manage it.                                                                     | `rules/provider.md` |

### App Orchestration

| Block           | Layer          | Summary                                                                | File                     |
| --------------- | -------------- | ---------------------------------------------------------------------- | ------------------------ |
| `use-case-hook` | `application/` | Orchestrates mutation + notification into one feature-level operation. | `rules/use-case-hook.md` |

### Component Patterns

| Block                | Layer          | Summary                                                                                                                        | File                          |
| -------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| `notification-hook`  | `application/` | Maps operation outcomes to toast notifications. One hook per use case.                                                         | `rules/notification-hook.md`  |
| `pure-component`     | `components/`  | Props in, JSX out. No side effects, no internal state beyond `useMemo`.                                                        | `rules/pure-component.md`     |
| `compound-component` | `components/`  | Dot-notation sub-components. Composition over configuration — no boolean prop toggles.                                         | `rules/compound-component.md` |
| `composer`           | `components/`  | Consumes a `{ state, meta }` / `{ state, actions }` contract; swappable + fixture source Providers fill it. Top of the ladder. | `rules/composer.md`           |
| `form`               | `components/`  | Context-driven form via `useForm` + `FormProvider` + field components.                                                         | `rules/form.md`               |
| `hoc`                | `components/`  | Component in → enhanced component out. For render-level decisions (auth gates, suspense wrappers).                             | `rules/hoc.md`                |
| `error-boundary`     | `components/`  | Scoped error handling for a feature component with its own query.                                                              | `rules/error-boundary.md`     |
| `page`               | `pages/`       | Route-level orchestrator. Only place where router coupling is acceptable.                                                      | `rules/page.md`               |
| `facade-hook`        | `components/`  | Private logic extraction for a single component. Defined below the component, not exported.                                    | `rules/facade-hook.md`        |
| `named-effect`       | `components/`  | Named function expressions in `useEffect`. Intent visible at a glance.                                                         | `rules/named-effect.md`       |

### Data Modeling

| Block            | Layer          | Summary                                                                                    | File                      |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------ | ------------------------- |
| `frontend-model` | `types/`       | UI-friendly domain objects mapped from DTOs. Skip if DTO shape is identical.               | `rules/frontend-model.md` |
| `value-object`   | `application/` | Static-method classes grouping domain logic for a single concept. Namespace, not instance. | `rules/value-object.md`   |

## Rules

- Block files live in `rules/` — one file per block.
- Each file contains: description, constraints, and a canonical code example.
- Block names are stable identifiers referenced in specs and task breakdowns.

---

# Rule: Composer

_Category: Component Patterns · Layer: components/_

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
- **Placement:** contract + Composer under the feature's UI layer; context-provider components in `application/`, never the `queries/` directory (that's the React-Query data layer).

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

---

# Rule: Compound Component

_Category: Component Patterns · Layer: components/_

## Compound Component

Rung 2 of the composition ladder. Parent exposes dot-notation sub-components (slots), consumers compose only the parts they need. Single import, internal structure hidden. The go-to for complex UI widgets (Tabs, Accordion, Select, Menu, list rows) where parts must coordinate but consumers need control over layout. Still just props — no feature-level context.

### Constraints

- Composition over configuration. If you're adding boolean props like `showHeader`, `showFooter`, `withSearch` — stop. Let the consumer compose the parts they need instead. Structure should be visible in JSX, not buried in prop logic.
- Slots spelled as props are still slots. Props like `leading`, `trailing`, `trailingSecondary` that take `ReactNode` mean the component styles content it never chose — make them real sub-components (`Media`, `Actions`).
- Expose a namespace object (`export const Item = { Root, Group, Content, … }`), not static properties assigned to a function. Each part is a named component in the same file.
- Context is optional. Sometimes the pattern is just about providing a clean dot-notation API and avoiding falsy props that a root component would only pass through to its internal children. Use Context when sub-components genuinely need to coordinate shared state (e.g. `Root` knowing it sits inside a `Group`); skip it when the sub-components are independent. Any coordination context here is an **implementation detail that never leaves the file** — not exported, no consumer hook — distinct from the feature-level contract a `composer` consumes (`rules/composer.md`).
- Prefer polymorphism over tag-swapping props. Let `Root` take a `render` (or `asChild`-style) prop so the same primitive can render as a `div`, an `<a>`, or a router `Link` — instead of accumulating `as` / `href` props. Genuine row state (e.g. `collapsed`) stays a plain prop on `Root`; not everything becomes a slot.
- Compose upward. When a feature needs an opinionated variant, wrap the primitive into a smaller named compound (`NavigationList = { Group, Item }` with slots pre-arranged) — don't re-implement it or add a flag to it.
- Start from Chakra UI's compound parts (`Card.Root`, `Tabs.Root`, …) when one fits; build your own only for a shape Chakra lacks.
- When the same markup must render data from **swappable or deferred sources**, don't add source props — climb to `composer` (`rules/composer.md`).
- Warning signs you need this: multiple boolean props toggling sections, `ReactNode` slot props, `as`/`href` props, large config objects controlling internal rendering, difficulty adding variations without modifying the component.
- Don't over-apply. Single-purpose components with no optional sections stay as single units (`pure-component`). Compound is for when consumers need structural flexibility.

### Example

```tsx
// ❌ Prop-based configuration — every screen adds a prop, slots hidden behind props
<Item
  leading={<ProductLogo product={product} />}
  title={product.name}
  subtitle={product.formattedPrice}
  trailing={<Badge>Awaiting signature</Badge>}
  trailingSecondary={<ChevronRight />}
  as="a"
  href={`/products/${product.id}`}
/>
```

```tsx
// ✅ item.tsx — namespace of slots. The Group context is internal: never exported.
const ItemGroupContext = createContext(false);

const ItemGroup = ({ children }: PropsWithChildren) => (
  <ItemGroupContext.Provider value={true}>
    <Stack role="list">{children}</Stack>
  </ItemGroupContext.Provider>
);

const ItemRoot = ({
  render,
  collapsed = false,
  children,
}: PropsWithChildren<{ render?: ReactElement; collapsed?: boolean }>) => {
  const grouped = use(ItemGroupContext);
  const element = (
    <HStack asChild={!!render} data-collapsed={collapsed}>
      {render ? cloneElement(render, {}, children) : <div>{children}</div>}
    </HStack>
  );
  return grouped ? <div role="listitem">{element}</div> : element;
};

const ItemMedia = ({ children }: PropsWithChildren) => (
  <Box flexShrink={0}>{children}</Box>
);
const ItemContent = ({ children }: PropsWithChildren) => (
  <Stack flex={1}>{children}</Stack>
);
const ItemTitle = ({ children }: PropsWithChildren) => (
  <Text fontWeight="medium">{children}</Text>
);
const ItemActions = ({ children }: PropsWithChildren) => (
  <HStack>{children}</HStack>
);

export const Item = {
  Root: ItemRoot,
  Group: ItemGroup,
  Media: ItemMedia,
  Content: ItemContent,
  Title: ItemTitle,
  Actions: ItemActions,
};
```

```tsx
// Consumer composes only what they need — any arrangement, no new props
<Item.Group>
  <Item.Root render={<Link to={`/products/${product.id}`} />}>
    <Item.Media>
      <ProductLogo product={product} />
    </Item.Media>
    <Item.Content>
      <Item.Title>{product.name}</Item.Title>
    </Item.Content>
    <Item.Actions>
      <Badge>Awaiting signature</Badge>
      <ChevronRight />
    </Item.Actions>
  </Item.Root>
</Item.Group>
```

```tsx
// Compose upward — a feature-level compound with slots pre-arranged, built on the primitive
const NavigationListItem = ({
  icon,
  to,
  children,
}: PropsWithChildren<{ icon: ReactNode; to: string }>) => (
  <Item.Root render={<Link to={to} />}>
    <Item.Media>{icon}</Item.Media>
    <Item.Content>
      <Item.Title>{children}</Item.Title>
    </Item.Content>
    <Item.Actions>
      <ChevronRight />
    </Item.Actions>
  </Item.Root>
);

export const NavigationList = { Group: Item.Group, Item: NavigationListItem };
```

---

# Rule: Dto Model

_Category: Data Fetching · Layer: lib/api/_

## Dto Model

TypeScript interfaces representing raw API response shapes — the wire format. Never use directly in UI or application logic; map to domain models when the shape diverges. Co-located with the `query-options-factory` that fetches the data.

### Constraints

- DTOs mirror the API contract exactly — no transformations, no computed fields, no UI conveniences. If the API returns `snake_case`, the DTO uses `snake_case`.
- One DTO file per resource endpoint. Shared sub-types (like `Rating`) live in the same file if they're only used by that DTO.
- Enums in DTOs represent server-defined value sets. Use `enum` when the API guarantees a closed set, union types when it doesn't.

### Example

```tsx
export enum Category {
  Men_clothing = "men's clothing",
  Women_clothing = "women's clothing",
  Jewelery = "jewelery",
  Electronics = "electronics",
}

export interface Rating {
  rate: number;
  count: number;
}

export interface ProductDto {
  id: number;
  title: string;
  description: string;
  category: Category;
  image: string;
  price: number;
  rating: Rating;
}
```

---

# Rule: Error Boundary

_Category: Component Patterns · Layer: components/_

## Error Boundary

Scoped runtime error handling for a feature component that runs its own query. Contains failure to the component's own DOM so the rest of the page keeps working. Catches both render errors and query fetch errors through a single wrapper.

### Constraints

- Only for components with their own **query hook**.
- `ErrorBoundary` and `withErrorBoundary` live in `src/lib/components/ErrorBoundary/`. Use `withErrorBoundary` by default — do not hand-roll.
- Add `throwOnError: true` on the query's `useQuery` call in `queries/`.
- No retry for ErrorBoundary by default.

### Example

```tsx
import { withErrorBoundary } from "@/lib/components/ErrorBoundary/with-error-boundary";

interface IProps {
  productId: string;
}

const ProductRatingBase = ({ productId }: IProps) => {
  const { data } = useMarketingProductQuery(productId);
  // render with data
};

const ProductRating = withErrorBoundary<IProps>(ProductRatingFallback)(
  ProductRatingBase
);

export { ProductRating };
```

---

# Rule: Facade Hook

_Category: Component Patterns · Layer: components/_

## Facade Hook

Encapsulates logic a component needs so the component body stays pure — focused entirely on rendering JSX. Defined below the component in the same file. Think of it as the component's private method: not exported, not reused, exists solely to keep the render function clean.

### Constraints

- One facade hook per component. If you need two, the component probably has two responsibilities.
- The hook returns exactly what the component's JSX needs — pre-shaped data, handlers, derived values. The component never transforms what the hook returns.
- Facade hooks are for logic extraction, not data fetching orchestration. Loading states, queries, and mutations stay in the component or page. The facade hook handles formatting, derivations, and non-trivial transformations.
- Don't confuse with shared hooks. A facade hook is private to its component. If multiple components need the same logic, that's a shared hook or `use-case-hook`, not a facade.

### Example

```tsx
interface Props {
  product: Product;
  locale: string;
}

// Component stays focused on rendering
export const ProductHeader = ({ product }: Props) => {
  const { displayTitle, priceLabel, badge } = useFormattedProduct(product);

  return (
    <div className="product-header">
      <h1>{displayTitle}</h1>
      {badge && <span className="badge">{badge}</span>}
      <span className="price">{priceLabel}</span>
    </div>
  );
};

// Facade hook — private, not exported, defined below the component
const useFormattedProduct = (product: Product) => {
  const displayTitle = useMemo(() => {
    const base = product.name.trim();
    const variant = product.variant ? ` — ${product.variant}` : "";
    const limited = product.isLimitedEdition ? " (Limited Edition)" : "";
    return `${base}${variant}${limited}`;
  }, [product.name, product.variant, product.isLimitedEdition]);

  const priceLabel = useMemo(() => {
    const formatter = new MoneyVO.format({
      style: "currency",
      currency: product.currency,
    });
    return product.discountPrice
      ? `${formatter.format(product.discountPrice)} (was ${formatter.format(product.price)})`
      : formatter.format(product.price);
  }, [product.price, product.discountPrice, product.currency]);

  const badge = useMemo(() => {
    if (product.stock === 0) return "Out of Stock";
    if (product.stock <= 3) return `Only ${product.stock} left`;
    if (product.isNew) return "New";
    return null;
  }, [product.stock, product.isNew]);

  return { displayTitle, priceLabel, badge };
};
```

---

# Rule: Form

_Category: Component Patterns · Layer: components/_

## Form

Context-driven form built on the project's `useForm` / `FormProvider` abstraction over react-hook-form. Use for any user input that submits data — creation forms, edit forms, settings panels, inline editors. Skip for single uncontrolled inputs (search bars, filters) that don't need validation or submit handling.

### Constraints

- ALWAYS add `noValidate` to the `<form>` element
- ALWAYS type the form with an explicit `interface` for field values — pass it as the generic to `useForm<MyValues>()`
- Use `FormProvider` at the form root. Field components (`TextInput`, `SelectInput`, `NumberInput`, `MoneyInput`, `TextareaInput`) read `control` and `configuration` from context — no prop drilling
- Use the `register` prop on field components for custom validation rules beyond `isRequired`
- Wire `onSubmit` through `form.handleSubmit(handler)` — never call the handler directly
- Set `configuration` in `useForm()` for form-wide visual settings (`size`, `variant`, `autoValidation`). Use `setConfiguration` only for runtime changes

### Conditional Fields

- MUST define conditional field components at **module scope** — never inside the parent component. Inline definitions cause React to remount the field on every parent re-render, destroying field state
- Use `useFieldBasedCondition` to toggle visibility based on another field's value. It handles value caching (when `keepHiddenFieldValue: true`) and cleanup automatically
- Use `useCondition` (lower-level) when you already have a derived boolean from outside the form

### Available Field Components

All fields accept: `name` (required), `label`, `isRequired`, `isDisabled`, `register`. They auto-display validation errors.

| Component       | Stored type        | Notes                                                                      |
| --------------- | ------------------ | -------------------------------------------------------------------------- |
| `TextInput`     | `string`           | Supports `type` (`email`, `password`, etc.)                                |
| `SelectInput`   | `Value \| Value[]` | `isMulti` for multi-select, trigger is `<button role="combobox">` in tests |
| `NumberInput`   | `number \| null`   | Chakra stepper + input                                                     |
| `MoneyInput`    | `number \| null`   | Left addon with `symbol` prop (`$`, `€`)                                   |
| `TextareaInput` | `string`           | Same as TextInput minus `type` and `autofocus`                             |

### Example

```tsx
// ✅ Correct — conditional field at module scope, noValidate, typed values
interface ProductValues {
  name: string;
  price: number;
  hasCoupon: string;
  couponCode: string;
}

const CouponField = () => {
  const isVisible = useFieldBasedCondition<ProductValues>("couponCode", {
    name: "hasCoupon",
    condition: (val) => (val as unknown as string) === "yes",
    defaultValue: "",
  });

  if (!isVisible) return null;
  return <TextInput name="couponCode" label="Coupon Code" />;
};

const CreateProductForm = ({
  onSubmit,
}: {
  onSubmit: (v: ProductValues) => void;
}) => {
  const form = useForm<ProductValues>({
    configuration: { autoValidation: true, size: "md" },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <TextInput name="name" label="Product Name" isRequired />
        <MoneyInput name="price" label="Price" symbol="$" isRequired />
        <SelectInput
          name="hasCoupon"
          label="Has Coupon?"
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <CouponField />
        <button type="submit">Create</button>
      </form>
    </FormProvider>
  );
};
```

### Anti-Patterns

- **Prop-drilling control/configuration** — passing `control` or field config as props instead of using `FormProvider` context. Breaks the abstraction and creates coupling
- **Skipping the `register` prop** — adding validation via raw `useController` or `useFormContext` when the field component already accepts `register` for custom rules
- **Testing SelectInput with `getByLabelText`** — the select trigger is `<button role="combobox">`, use `getByRole("combobox", { name: "Label" })` instead

### References

- `@src/lib/components/Form/` — source for `useForm`, `FormProvider`, all field components
- `@src/lib/components/Form/Form.mdx` — full API documentation with props tables

---

# Rule: Frontend Model

_Category: Data Modeling · Layer: types/_

## Frontend Model

Frontend-friendly domain objects parsed or transformed from `dto-model`. Contains the shape your UI actually needs — renamed fields, computed properties, flattened nesting. Defined in `types/` of the feature slice.

### Constraints

- DTOs are the wire format, frontend models are the app format. When they diverge, map explicitly — don't let DTO shapes leak into components or application.
- Keep models as plain interfaces/types — no methods, no class instances. Domain logic lives in `value-object` if needed.
- If the DTO and frontend model are identical, skip the frontend model. Don't add a layer just for the sake of it.

### Example

```tsx
// types/product.ts — what the UI actually works with
export interface Product {
  id: string;
  name: string; // renamed from dto.title
  price: number;
  category: string;
  imageUrl: string; // renamed from dto.image
  rating: number; // flattened from dto.rating.rate
  reviewCount: number; // flattened from dto.rating.count
}
```

---

# Rule: Higher-Order Component

_Category: Component Patterns · Layer: components/_

## Higher-Order Component

Component in → enhanced component out. The pre-hooks pattern for cross-cutting concerns: auth guards, error boundaries, suspense wrappers, analytics instrumentation, permission gates. Still earns its place when the concern is about **whether or how** a component renders, not about data it needs — hooks can't conditionally render a different component.

### Constraints

- Use sparingly. If the enhancement is "give this component some data," a hook is almost always simpler. HOCs shine for render-level decisions: show/hide, wrap in boundary, gate on permission.
- Always forward props with generics (`<TProps extends object>`) to preserve the wrapped component's type contract. Set `displayName` for DevTools — the `eslint-disable` on display name is a known cost.

### Example

```tsx
import { type ComponentType, Suspense, type SuspenseProps } from "react";

// Generic suspense wrapper — avoids repeating <Suspense> at every lazy boundary
export const withSuspense =
  <TProps extends object>(fallback?: SuspenseProps["fallback"]) =>
  (Component: ComponentType<TProps>) => {
    const Wrapped = (props: TProps) => (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
    Wrapped.displayName = `withSuspense(${
      Component.displayName ?? Component.name
    })`;
    return Wrapped;
  };
```

```tsx
// Usage
const LazyDashboard = withSuspense(<Spinner />)(CartItem);
```

---

# Rule: Machine

_Category: State Management · Layer: application/_

## Machine

XState v5 machine for multi-step async flows a `store` can't express — ordered steps, error-driven branching, "X only allowed in state Y" (checkout, auth, wizards). The machine owns the flow. Its actors are the slice's own `queries/`; only host-specific concerns (the cart id, what to do on success) are injected, so `features/checkout/` never imports `features/carts/`.

### Constraints

- **Discriminated-union context keyed by `type`** — one member per phase, each carrying only the fields valid in that phase. Derive phase types with `OneOfUnion<Ctx, "PHASE">` (from `lib/`); `assign` a fresh `type` on every transition, never spread optional fields onto a flat context.
- **Actors declared as `PromiseActorLogic<Out, In>`, never called inside the machine.** Reference by name (`src: "initiate"`); the provider supplies real ones via `machine.provide({ actors })` + `fromPromise`. The actors wrap this slice's own `queries/` — that is allowed. What stays out is sibling-slice and host coupling: inject the cart id and the success callback, don't import `features/carts/`.
- **Type actor rejections with `ErrorActorEvent<Id, Err>`** (from `lib/types/`) in the events union — `ErrorActorEvent<"initiate", CheckoutError>`. This types `event.error` as your domain error instead of `unknown`, so guards narrow it with `instanceof` rather than probing the payload.
- **Name reused logic in `setup`** — an `assign`/`emit` or guard used by more than one transition goes in `setup({ actions / guards })` and is referenced by name (`actions: "assignSession"`, `guard: "isOutOfStock"`). Inline only genuinely one-off logic. Build repetitive error guards with `isErrorOf(ErrorClass)` (from `lib/`) so each is a one-liner.
- **Guard on context, not just errors** — error guards (`isErrorOf`) pick the branch _into_ a state; context guards (derived from `context`, e.g. `failedStep`) pick the branch _out_. Recording which step failed lets `failed` RETRY that exact step instead of restarting the flow.
- **Talk outward with `emit`, not callbacks** — emit a typed event; the provider subscribes (`actor.on("*")` in a named effect) and reacts. The machine never imports the consequence.
- **Tag loading states** (`tags: ["loading"]`) so components read one flag.
- **Three files**: `checkout-machine.ts`, `checkout-actor-context.tsx` (context + `useCheckoutSelector` / `useCheckoutSend` / `useCheckoutActorContext`), `CheckoutActorProvider.tsx` (provides actors, wires emitted events). Components consume via the hooks, never the actor directly.

### Example

```ts
import { assign, emit, setup, type PromiseActorLogic } from "xstate";

import {
  EmptyCartError,
  OutOfStockError /* … */,
} from "@/features/checkout/types/checkout-error";
import { isErrorOf } from "@/lib/is-error-of";
import type { ErrorActorEvent } from "@/lib/types/error-actor-event";
import type { OneOfUnion } from "@/lib/types/one-of-union";

// AIDEV-NOTE: which step's actor rejected — so `failed` can RETRY that exact step.
type CheckoutStep = "initiate" | "apply" | "confirm";

type CheckoutMachineContext =
  | { type: "INITIAL"; cartId: string }
  | { type: "SESSION_READY"; cartId: string; session: CheckoutSession }
  | {
      type: "FAILED";
      cartId: string;
      session?: CheckoutSession;
      error: CheckoutError;
      failedStep: CheckoutStep;
    };

export type FailedContext = OneOfUnion<CheckoutMachineContext, "FAILED">;

type CheckoutMachineEvents =
  | { type: "CONFIRM" }
  | { type: "RETRY" }
  // typed rejection per actor → event.error is CheckoutError, not unknown
  | ErrorActorEvent<"initiate", CheckoutError>
  | ErrorActorEvent<"confirm", CheckoutError>;

export interface CheckoutMachineActors {
  initiate: PromiseActorLogic<CheckoutSession, string>; // wraps this slice's queries/
  confirm: PromiseActorLogic<Order, { session: CheckoutSession }>;
}

// catch-all branch sees event.error as unknown — coerce once
const toCheckoutError = (error: unknown): CheckoutError =>
  error instanceof Error
    ? (error as CheckoutError)
    : (new Error("Unexpected checkout error") as CheckoutError);

export type CheckoutMachineType = typeof checkoutMachine;

export const checkoutMachine = setup({
  types: {} as {
    context: CheckoutMachineContext;
    events: CheckoutMachineEvents;
    emitted: { type: "ORDER_CONFIRMED"; order: Order };
    input: { cartId: string };
  },
  actors: { ...({} as CheckoutMachineActors) },
  actions: {
    // reused by every onDone that produces a session — XState widens event to the full
    // union here, so narrow to the actor-output shape via unknown.
    assignSession: assign(({ context, event }) => ({
      type: "SESSION_READY" as const,
      cartId: context.cartId,
      session: (event as unknown as { output: CheckoutSession }).output,
    })),
    // one fail action per step — keeps the thrown CheckoutError verbatim and records the step
    failAtConfirm: assign(({ context, event }) => ({
      type: "FAILED" as const,
      cartId: context.cartId,
      error: toCheckoutError("error" in event ? event.error : undefined),
      failedStep: "confirm" as const,
    })),
  },
  guards: {
    isEmptyCart: isErrorOf(EmptyCartError), // builder → one-liner per error class
    isOutOfStock: isErrorOf(OutOfStockError),
    failedAtConfirm: ({ context }) =>
      context.type === "FAILED" && context.failedStep === "confirm",
  },
}).createMachine({
  id: "checkout",
  initial: "initiating",
  context: ({ input }) => ({ type: "INITIAL", cartId: input.cartId }),
  states: {
    initiating: {
      tags: ["loading"],
      invoke: {
        src: "initiate",
        input: ({ context }) => context.cartId,
        onDone: { target: "review", actions: "assignSession" },
        onError: [
          {
            guard: "isEmptyCart",
            target: "emptyCart",
            actions: "failAtInitiate",
          },
          { target: "failed", actions: "failAtInitiate" }, // catch-all last
        ],
      },
    },
    review: { on: { CONFIRM: { target: "confirming" } } },
    confirming: {
      tags: ["loading"],
      invoke: {
        src: "confirm",
        input: ({ context }) => ({ session: requireSession(context) }),
        onDone: {
          target: "confirmed",
          actions: [
            assign(/* type: "CONFIRMED", order: event.output */),
            // provider subscribes to ORDER_CONFIRMED → invalidates cart query. Machine
            // stays decoupled from carts.
            emit(({ event }) => ({
              type: "ORDER_CONFIRMED" as const,
              order: event.output,
            })),
          ],
        },
        onError: [
          {
            guard: "isOutOfStock",
            target: "outOfStock",
            actions: "failAtConfirm",
          },
          { target: "failed", actions: "failAtConfirm" },
        ],
      },
    },
    failed: {
      on: {
        // context guard branches OUT — retry the exact step that failed
        RETRY: [
          { guard: "failedAtConfirm", target: "confirming" },
          { guard: "failedAtInitiate", target: "initiating" },
        ],
      },
    },
    outOfStock: {},
    emptyCart: { type: "final" },
    confirmed: { type: "final" },
  },
});
```

```tsx
// CheckoutActorProvider.tsx — provides actors (own queries/), injects host concerns,
// wires emitted events via a named effect.
const checkoutActor = useActorRef(
  checkoutMachine.provide({
    actors: {
      initiate: fromPromise(({ input }) => initiateCheckout({ cartId: input })),
      confirm: fromPromise(({ input }) => confirmCheckout(input)),
    } satisfies CheckoutMachineActors,
  }),
  { input: { cartId } } // cartId + onConfirmed are the only injected host concerns
);

useEffect(
  function subscribeToCheckoutEvents() {
    const subscription = checkoutActor.on("*", (event) => {
      if (event.type === "ORDER_CONFIRMED") onConfirmed(event.order);
    });
    return subscription.unsubscribe;
  },
  [checkoutActor, onConfirmed]
);
// <CheckoutActorContext.Provider value={checkoutActor}>
```

```tsx
// checkout-actor-context.tsx — typed selector + send hooks over the actor
export const CheckoutActorContext = createContext<
  ActorRefFrom<CheckoutMachineType>
>({} as ActorRefFrom<CheckoutMachineType>);

export function useCheckoutSelector<T>(
  selector: (snapshot: SnapshotFrom<CheckoutMachineType>) => T
) {
  const actor = useContext(CheckoutActorContext);
  if (!actor) throw new Error("CheckoutActorContext is missing the provider");
  return useSelector(actor, selector);
}

export function useCheckoutSend() {
  const actor = useContext(CheckoutActorContext);
  if (!actor) throw new Error("CheckoutActorContext is missing the provider");
  return actor.send;
}
// useCheckoutActorContext() returns the actor itself, for the rare consumer that needs it.
```

---

# Rule: Mutation Hook

_Category: Data Fetching · Layer: queries/_

## Mutation Hook

Server write hook composed from `mutation-options-factory`. Spreads the factory options and adds e.g. cache invalidation or custom error handling. Returns a `[handler, isPending]` tuple. Lives in `queries/` — the data access gateway for the feature slice.

### Constraints

- ALWAYS use `use` prefix — `useXxxMutation`, never `xxxMutation`. File: `use-xxx-mutation.ts`
- Compose from a `mutation-options-factory` via spread
- Invalidation belongs here — the hook knows what queries to invalidate via `query-keys-factory`
- When the consumer needs to extend `onSuccess` (e.g., close a modal after mutation), spread and chain the factory's callbacks

### Example

```tsx
// src/features/carts/queries/use-add-to-cart-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartMutationOptions } from "@/lib/api/carts/add-to-cart/add-to-cart-mutation";
import { cartQueryKeys } from "@/lib/api/carts/cart-query-keys";

export const useAddToCartMutation = (cartId: number) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    ...addToCartMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKeys.detail(cartId),
      });
    },
  });

  const handler = async (payload: AddToCartPayload) => {
    return mutateAsync({ cartId, payload });
  };

  return [handler, isPending] as const;
};
```

### References

- `rules/mutation-options-factory.md` — raw factory pattern in `lib/api/`
- `rules/query-keys-factory.md` — cache key structure for invalidation

---

# Rule: Mutation Options Factory

_Category: Data Fetching · Layer: lib/api/_

## Mutation Options Factory

Reusable `mutationOptions()` factory for a single API write operation. Contains `mutationFn` with domain error translation and logging.

### Constraints

- NEVER use `use` prefix — these are factories, not hooks. Name: `xxxMutationOptions`. File: `xxx-mutation.ts`
- One factory per API endpoint. Co-locate with related query options in the same resource directory
- Co-locate mutation types (payload & dto) and error classes with the factory. Map API errors exhaustively in `mutationFn` — translate, log, fall back to `UnknownError`

### Example

```tsx
// src/lib/api/carts/add-to-cart/add-to-cart-mutation.ts
import { mutationOptions } from "@tanstack/react-query";
import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

interface AddToCartPayload {
  productId: number;
  quantity?: number;
}

interface AddToCartDto {
  cartId: number;
  payload: AddToCartPayload;
}

export const addToCartMutationOptions = mutationOptions({
  mutationFn: async (body: AddToCartDto): Promise<void> => {
    try {
      await httpService.put<void, AddToCartPayload>(
        `carts/${body.cartId}`,
        body.payload
      );
    } catch (e) {
      Logger.error("Failed to add item to cart", e as Error);
      if (httpService.isError(e) && e.message === "Unknown product") {
        throw new UnknownProductError();
      }
      if (httpService.isError(e) && e.message === "Product not available") {
        throw new ProductNotAvailableError();
      }
      throw new UnknownError();
    }
  },
});

export class UnknownProductError extends Error {
  constructor() {
    super("Unknown product");
    this.name = "UnknownProductError";
  }
}

export class ProductNotAvailableError extends Error {
  constructor() {
    super("Product not available");
    this.name = "ProductNotAvailableError";
  }
}
```

```tsx
// ❌ Wrong — invalidation in factory
export const addToCartMutationOptions = mutationOptions({
  mutationFn: async (body: AddToCartDto): Promise<void> => {
    await httpService.put(`carts/${body.cartId}`, body.payload);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
  },
});
```

### References

- `@src/lib/api/` — resource-organized API directory
- `rules/mutation-hook.md` — composing hook pattern in `queries/`

---

# Rule: Named Effect

_Category: Component Patterns · Layer: components/_

## Named Effect

Pass named function expressions to `useEffect` instead of anonymous arrows. Intent is visible at a glance: `useEffect(function trackWindowWidth() { ... }, [])`. Reveals over-responsibility and unnecessary effects during review — if you can't name it clearly, you probably shouldn't have it.

### Constraints

- The name **is** the documentation. `trackWindowWidth` tells reviewers what the effect does without reading the body.
- If naming the effect is hard, the effect is doing too much. Split it or question whether it's needed at all.
- Works especially well in facade hooks where multiple effects may coexist — named effects turn the hook into a readable table of contents.

### Example

```tsx
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(function trackWindowWidth() {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
```

---

# Rule: Notification Hook

_Category: Component Patterns · Layer: application/_

## Notification Hook

Side-effect hook that maps operation outcomes to user-facing toast notifications. Returns a bag of named notify functions — one per outcome (`notifySuccess`, `notifyFailure`, `notifyUnknownProduct`, etc.). Keeps toast configuration, i18n keys, and status mapping in one place.

### Constraints

- One notification hook per use case, not per mutation. If a flow has multiple mutations that share the same feedback patterns, one hook covers them.
- Lives in `application/` alongside `use-case-hook` — it's a side-effect concern, not presentational.

### Example

```tsx
import { useToast } from "@/lib/components/Toast/use-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

export const useAddToCartNotifications = () => {
  const t = useTranslations("features.carts.add-to-cart.notifications");
  const toast = useToast();

  const notifySuccess = () =>
    toast({
      status: "success",
      title: t("title"),
      description: t("success"),
    });

  const notifyNotAuthenticated = () =>
    toast({
      status: "warning",
      title: t("title"),
      description: t("not-authenticated"),
    });

  const notifyUnknownProduct = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("unknown-product-error"),
    });

  const notifyProductNotAvailable = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("product-not-available-error"),
    });

  const notifyFailure = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("error"),
    });

  return {
    notifySuccess,
    notifyFailure,
    notifyNotAuthenticated,
    notifyUnknownProduct,
    notifyProductNotAvailable,
  } as const;
};
```

---

# Rule: Page

_Category: Component Patterns · Layer: pages/_

## Page

Composes presentation components into a complete screen. The only place where coupling to router state (params, search params, navigation) is acceptable. Pages are the seam between routing and UI — they read route context and pass plain props downward.

### Constraints

- Pages should be thin orchestrators: pull route params, invoke hooks, pass props to pure components. If a page has significant logic, extract it into a `facade-hook` or `use-case-hook`.
- One page per route. If two routes share 90% of their UI, extract the shared part into a component — don't make one page serve two routes with conditionals.
- Page loaders in `src/pages/<Page>/loader.ts` compose resource-level loaders from query-options-factory

### Example

```tsx
import { useProductQuery } from "@/features/products/queries/product-query";
import { ProductDetails } from "@/features/products/components/ProductDetails";
import { Page } from "@/lib/components/Layout/Page";
import { useNavigate, useParams } from "@/lib/router";

const ProductPage = () => {
  const params = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data } = useProductQuery(params.productId!);

  return (
    <Page gap={6}>
      <Button variant="plain" onClick={() => navigate("/products")}>
        <ArrowLeft />
        Back to list
      </Button>
      <ProductDetails product={data} onBack={() => navigate("/products")} />
    </Page>
  );
};

// Router-level exports — page owns its error boundary
export const Component = ProductPage;

export const ErrorBoundary = () => {
  const error = useRouteError();
  if (error instanceof ResourceNotFoundException) {
    return <ProductNotFoundResult />;
  }
  return <InternalErrorResult />;
};
```

---

# Rule: Provider

_Category: State Management · Layer: queries/_

## Provider

React Context providers acting as dependency injection for the component tree. Deliver feature-level state — cart contents, current workspace, active filters — without prop drilling. Keep providers thin: they deliver state, they don't manage it. State logic belongs in the store or machine; the provider just makes it available.

Two things share the word "provider" — don't blur them:

- This block, a **context-provider component**, lives in `application/` (or the feature's UI layer). The `queries/` **directory** is the React-Query data-access layer (query/mutation hooks) — a different concept entirely.
- A **source Provider** is a specialization of this block that fills a Composer's contract and is interchangeable with other sources (including a fixture source). When you have a `*Composer` consuming a `{ state, meta }` or `{ state, actions }` contract, see `rules/composer.md` — that is the same context mechanism aimed at swappable sources.

### Constraints

- Two files per provider: one for the context (with `createContext` + the consumer hook), one for the provider component (accepts `PropsWithChildren`). Separating them keeps the dependency graph clean — consumers import the hook, not the provider.
- Never put business logic in providers. If a provider has `useEffect`, `useReducer`, or complex derivations, the logic needs to move into a dedicated store or hook that the provider merely wraps.
- Default context value: use `null` and throw in the consumer hook. This catches missing providers at runtime instead of silently returning garbage.

### Example

```tsx
// cart-context.ts — context + consumer hook
import { createContext, useContext } from "react";

interface CartContextValue {
  cartId: string;
  items: CartItem[];
}

const CartContext = createContext<CartContextValue | null>(null);

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export { CartContext };
```

```tsx
// CartProvider.tsx — thin wrapper, no logic
import { type PropsWithChildren } from "react";
import { CartContext } from "./cart-context";
import { useCartStore } from "./use-cart-store"; // state lives here

export const CartProvider = ({ children }: PropsWithChildren) => {
  const { cartId, items } = useCartStore();

  return (
    <CartContext.Provider value={{ cartId, items }}>
      {children}
    </CartContext.Provider>
  );
};
```

```tsx
// Usage — components import the hook, never the provider or context directly
const CartSummary = () => {
  const { items } = useCart();
  return <span>{items.length} items in cart</span>;
};
```

---

# Rule: Pure Component

_Category: Component Patterns · Layer: components/_

## Pure Component

Props in, JSX out. No side effects, no internal state, no hooks beyond maybe `useMemo` for derived values. Maximally testable, maximally reusable — the default component type until you need something more.

### Constraints

- If it has complex `useState`s or/and `useEffect`s, extract it into a `facade-hook` and keep the component pure. The component becomes a function of props — easy to test and reason about.
- Can subscribe to contexts via `useContext` when needed. Reading theme, locale, or feature flags doesn't break purity as long as the component remains a deterministic function of its inputs (props + context).
- Pure doesn't mean simple. A pure component can have complex rendering logic — conditionals, loops, computed styles — as long as it's all derived from props with no external dependencies beyond context.

### Example

```tsx
interface Props {
  name: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  onAddToCart: () => void;
}

export const ProductCard = ({
  name,
  price,
  imageUrl,
  isAvailable,
  onAddToCart,
}: Props) => (
  <div className="product-card">
    <img src={imageUrl} alt={name} />
    <h3>{name}</h3>
    <span>{formatCurrency(price)}</span>
    <button onClick={onAddToCart} disabled={!isAvailable}>
      {isAvailable ? "Add to Cart" : "Out of Stock"}
    </button>
  </div>
);
```

---

# Rule: Query Keys Factory

_Category: Data Fetching · Layer: lib/api/_

## Query Keys Factory

Hierarchical, co-located key factories enabling precise cache invalidation and query management. One factory per resource, each key level narrows scope: `all` → `lists` → `list(params)` → `details` → `detail(id)` → nested sub-resources. (TkDodo: Effective React Query Keys)

### Constraints

- Keys are `as const` tuples — TypeScript enforces structure, no stringly-typed accidents.
- Each level spreads from its parent, so invalidating `cartQueryKeys.all` wipes every cart-related query, while `cartQueryKeys.detail(id)` targets one.
- Mutation hooks import these for `onSuccess` invalidation — the factory is the single source of truth for what "cart queries" means.
- Sub-resources nest under their parent: `detail(cartId) → products(cartId)`. Invalidating a detail also catches its children.

### Example

```tsx
import type { QueryParams } from "@/types/query-params";

export const productsQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productsQueryKeys.all, "list"] as const,
  list: (params: QueryParams) =>
    [...productsQueryKeys.lists(), params] as const,
  details: () => [...productsQueryKeys.all, "detail"] as const,
  detail: (productId: string) =>
    [...productsQueryKeys.details(), productId] as const,
};
```

---

# Rule: Query Options Factory

_Category: Data Fetching · Layer: lib/api/_

## Query Options Factory

Reusable, composable query configuration objects via `queryOptions()`. Export a factory function — not a custom hook — so consumers can spread and override options without losing type safety.

### Constraints

- Avoid wrapping `queryOptions` in custom hooks that swallow options — the factory **is** the abstraction. Hook composition belongs in `queries/`.
- Co-located with its `dto-model` and `query-keys-factory` for the same resource.
- The factory wires together the query key (from `query-keys-factory`) and the fetch function — consumers never assemble these manually.
- Name: `xxxQuery`. File: `xxx-query.ts`. Hook composition (`useXxxQuery`) belongs in `queries/`.
- When the query is used in a route loader, co-locate `xxxLoader` function in the same file.

### Example

```tsx
import { queryOptions } from "@tanstack/react-query";
import { httpService } from "@/lib/http"; // project HTTP client
import { productsQueryKeys } from "../products-query-keys"; // query-keys-factory
import type { ProductDto } from "./product-dto"; // dto-model

export const productQuery = (productId: string) =>
  queryOptions({
    queryKey: productsQueryKeys.detail(productId),
    queryFn: (): Promise<ProductDto> =>
      httpService.get<ProductDto>(`products/${productId}`),
  });

// only when needed by page
export const productLoader = async (productId: string) =>
  queryClient.ensureQueryData(productQuery(productId));
```

```tsx
// queries/ — hook composition wraps the factory, this is the only place useQuery is called
import { useQuery } from "@tanstack/react-query";
import { productQuery } from "@/lib/api/products/product-query";

export const useProductQuery = (productId: string) =>
  useQuery(productQuery(productId));
```

---

# Rule: Store

_Category: State Management · Layer: application/_

## Store

Lightweight global state via Zustand — lives outside the React tree. Good for cross-component shared state, persisted state, and state accessed outside components (e.g. in loaders or utilities).

### Constraints

- Always use selectors when subscribing: `useStore((s) => s.field)`, never `useStore()`. Prevents unnecessary re-renders.
- Actions live inside the store, not in components. Components read state and call actions — they don't `set()` directly.
- Keep stores small and focused — one store per concern, not one mega-store per feature.

### Example

```tsx
import { create } from "zustand";

interface BearStore {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
}

export const useBearStore = create<BearStore>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));
```

```tsx
// Component — always subscribe via selector
const bears = useBearStore((state) => state.bears);
```

---

# Rule: Use Case Hook

_Category: App Orchestration · Layer: application/_

## Use Case Hook

Orchestration hook that composes a `mutation-hook` and a `notification-hook` into a single feature-level operation. Returns `{ <domainAction>, isPending }` so the component calls one function and handles only UI concerns.

### Constraints

- One use case hook per user-facing operation, not per mutation. If "add to cart" requires a mutation + toast + dialog, that's one use case hook.
- Error routing (which error → which notification) belongs here, not in the component. The component just calls the action.
- Keep it thin — orchestration only, no business logic. If you're adding conditionals beyond error routing, the logic probably belongs in a service or the mutation itself.
- The use case hook is the feature's public API — components import `useAddToCart`, never the underlying mutation hook directly.
- **Name the returned action after the domain operation** — derive it from the hook name (drop `use`, camelCase). E.g. `useAddToCart` → `addToCart`.

### Example

```tsx
import {
  useAddToCartMutation,
  UnknownProductError,
  ProductNotAvailableError,
} from "@/features/carts/queries/use-add-to-cart-mutation"; // mutation-hook re-export
import { useAddToCartNotifications } from "./use-add-to-cart-notifications"; // notification-hook

export const useAddToCart = () => {
  const [mutateAsync, isPending] = useAddToCartMutation();
  const {
    notifySuccess,
    notifyFailure,
    notifyUnknownProduct,
    notifyProductNotAvailable,
  } = useAddToCartNotifications();

  const addToCart = async (payload: {
    productId: number;
    quantity?: number;
  }) => {
    try {
      await mutateAsync(payload);
      notifySuccess();
    } catch (e) {
      if (e instanceof UnknownProductError) {
        notifyUnknownProduct();
        return;
      }
      if (e instanceof ProductNotAvailableError) {
        notifyProductNotAvailable();
        return;
      }
      notifyFailure();
    }
  };

  return { addToCart, isPending };
};
```

```tsx
// Component usage
const { addToCart, isPending } = useAddToCart();

<Button
  loading={isPending}
  onClick={() => addToCart({ productId, quantity: 1 })}
>
  Add to cart
</Button>;
```

---

# Rule: Value Object

_Category: Data Modeling · Layer: application/_

## Value Object

Classes with static methods encapsulating domain logic and correlated utilities for a single concept. Type guards, formatters, validators, parsers, domain operations — give functions a home instead of homeless exports. One class = one concept + all its operations.

### Constraints

- All methods are static — value objects are namespaces with type safety, not instances with state.
- Group by concept, not by operation type. `Price.format()`, `Price.isValid()`, `Price.fromCents()` — not a `formatters.ts` file with `formatPrice`, `formatDate`, `formatName`.
- For domain computations, the value object belongs to the feature that owns the result. Cart total → `Cart.calculateTotal(items)`, not a loose `calculateCartTotal` utility.

### Example

```tsx
// src/lib/format
export class Price {
  static format(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  }

  static fromCents(cents: number): number {
    return cents / 100;
  }

  static isValid(amount: unknown): amount is number {
    return typeof amount === "number" && amount >= 0 && Number.isFinite(amount);
  }
}
```

```tsx
// Domain computation spanning multiple objects — belongs to the concept that owns the result
// src/features/carts/application
export class Cart {
  private static readonly DISCOUNT_THRESHOLD = 100;
  private static readonly DISCOUNT_PERCENT = 10;

  static calculateTotal(items: CartItem[]): number {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return Cart.isEligibleForDiscount(subtotal)
      ? subtotal * (1 - Cart.DISCOUNT_PERCENT / 100)
      : subtotal;
  }

  private static isEligibleForDiscount(subtotal: number): boolean {
    return subtotal >= Cart.DISCOUNT_THRESHOLD;
  }
}
```

```tsx
// Usage — all price-related logic in one place
Price.format(product.price); // "$29.99"
Price.fromCents(2999); // 29.99
Price.isValid(product.price); // true

// Usage - use Value Object rather than loose utilities
Cart.calculateTotal(products);
```
