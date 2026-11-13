## Visual Story

An existing story opted into screenshot comparison with the `visual` tag. The `storybook-visual` Vitest project renders
it, runs its play function, then captures the page with `toMatchScreenshot` and compares it with the committed baseline.
The reasoning (which stories, determinism, review) is in `docs/visual-testing.md`.

### Constraints

- Tag only stories that pass the questions in `docs/visual-testing.md` §3. Never tag every story.
- Tag the meta when every story in the file qualifies: `tags: ["visual"]`. Otherwise tag single stories. Opt one story
  out of a tagged meta with `tags: ["!visual"]`.
- No screenshot code in stories. Capture is automatic (`.storybook/visual.setup.ts`), named after the story, after
  render and play. Stories keep importing only from `storybook/test`.
- An interactive visual story asserts its behaviour in `play` before the capture.
- The story is deterministic: fixtures and MSW only, no remote images, no `Math.random` or `Date.now` in args, no
  loading spinners, skeletons or toasts in the captured state.
- Never add sleeps, retries or masks to make a story stable — fix the input, or drop the tag.
- Never raise `threshold` or `allowedMismatchedPixelRatio`. A per-story override needs a comment naming the noise source.
- Baselines live in `__screenshots__/<story file>/<story>-chromium.png` next to the story and are committed.
- Never run `--update` on the host (the config refuses it). Generate baselines only with `pnpm test:visual:update`
  (Docker, pinned Playwright image). The first run of a new story writes the reference and fails; review the PNG, then
  run again.
- Delete the PNGs of renamed or removed stories.

### Commands

- `pnpm test:visual` — compare (in CI; locally only inside the pinned image: `pnpm test:visual:docker`)
- `pnpm test:visual:update` — regenerate baselines in the container

### Example

```tsx
const meta = {
  component: NotFoundResult,
  tags: ["visual"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof NotFoundResult>;

export const Default: Story = {};
export const WithAction: Story = {
  args: {
    children: <Button colorPalette="blue">{"Back to home page"}</Button>,
  },
};
```

### Anti-patterns

- Tagging a `SigningIn`-style story whose captured end state is a toast.
- Tagging a story whose fixture loads an image from the internet.
- A PR that regenerates many baselines with no explanation of the intended change.
