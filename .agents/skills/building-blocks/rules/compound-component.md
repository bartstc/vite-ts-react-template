---
title: Compound Component
category: Component Patterns
layer: components/
composedWith: pure-component, facade-hook
---

## Compound Component

Parent exposes dot-notation sub-components, consumers compose only the parts they need. Single import, internal structure hidden. The go-to for complex UI widgets (Tabs, Accordion, Select, Menu) where parts must coordinate but consumers need control over layout.

### Constraints

- Composition over configuration. If you're adding boolean props like `showHeader`, `showFooter`, `withSearch` — stop. Let the consumer compose the parts they need instead. Structure should be visible in JSX, not buried in prop logic.
- Context is optional. Sometimes the pattern is just about providing a clean dot-notation API and avoiding falsy props that a root component would only pass through to its internal children. Use Context when sub-components genuinely need to coordinate shared state; skip it when the sub-components are independent.
- Warning signs you need this: multiple boolean props toggling sections, large config objects controlling internal rendering, difficulty adding variations without modifying the component.
- Don't over-apply. Single-purpose components with no optional sections stay as single units. Compound is for when consumers need structural flexibility.

### Example

```tsx
// ❌ Prop-based configuration — inflexible, combinatorial explosion
interface Props {
  showHeader: boolean;
  showSearch: boolean;
  actions: Action[];
}

function ActionsMenu({ showHeader, showSearch, actions }: Props) {
  return (
    <div>
      {showHeader && <h2>Actions</h2>}
      {showSearch && <SearchInput />}
      <ul>
        {actions.map((action) => (
          <li key={action.id}>{action.label}</li>
        ))}
      </ul>
    </div>
  );
}
```

```tsx
// ✅ Composition-based — each sub-component has one job,
// structure is visible in JSX, only render what you need.
// No Context needed here — sub-components are independent.
function ActionsMenu({ children }: { children: React.ReactNode }) {
  return <div className="actions-menu">{children}</div>;
}

ActionsMenu.Header = ({ children }: { children: React.ReactNode }) => (
  <div className="actions-menu__header">{children}</div>
);

ActionsMenu.Search = ({ onSearch }: { onSearch: (query: string) => void }) => (
  <input onChange={(e) => onSearch(e.target.value)} />
);

ActionsMenu.List = ({ children }: { children: React.ReactNode }) => (
  <ul className="actions-menu__list">{children}</ul>
);

ActionsMenu.Item = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => <li onClick={onClick}>{children}</li>;
```

```tsx
// Consumer composes only what they need
<ActionsMenu>
  <ActionsMenu.Header>Actions</ActionsMenu.Header>
  <ActionsMenu.Search onSearch={handleSearch} />
  <ActionsMenu.List>
    {actions.map((action) => (
      <ActionsMenu.Item key={action.id} onClick={action.handler}>
        {action.label}
      </ActionsMenu.Item>
    ))}
  </ActionsMenu.List>
</ActionsMenu>
```
