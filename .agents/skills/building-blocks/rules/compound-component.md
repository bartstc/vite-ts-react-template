---
title: Compound Component
category: Component Patterns
layer: components/
composedWith: pure-component, facade-hook, composer
---

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
