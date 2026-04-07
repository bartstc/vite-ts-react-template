---
title: Store
category: State Management
layer: application/
composedWith: use-case-hook, components
---

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
