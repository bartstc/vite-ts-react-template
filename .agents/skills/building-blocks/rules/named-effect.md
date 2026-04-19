---
title: Named Effect
category: Component Patterns
layer: components/
composedWith: facade-hook, pure-component
---

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
