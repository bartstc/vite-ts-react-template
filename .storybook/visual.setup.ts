// AIDEV-NOTE: loaded only by the `storybook-visual` Vitest project (docs/visual-testing.md).
// Uses Vitest's `expect` on purpose: `storybook/test` exports a Chai `expect` without
// `toMatchScreenshot`. Stories never import this file.
import { afterEach, beforeAll, expect, vi } from "vitest";
import { page } from "vitest/browser";

const FROZEN_NOW = new Date("2025-01-15T10:00:00Z");

const MOTION_OFF_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; }
`;

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

beforeAll(() => {
  // Chakra's enter/exit animations ignore prefers-reduced-motion, so emulation alone is not enough.
  const style = document.createElement("style");
  style.textContent = MOTION_OFF_CSS;
  document.head.appendChild(style);

  // Freeze only Date, so promises, MSW and TanStack Query timers keep running.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(FROZEN_NOW);
});

afterEach(async (ctx) => {
  // A story that failed its own assertions is never captured.
  if (ctx.task.result?.state === "fail") return;

  await document.fonts.ready;
  // Whole body, so Chakra portals (dialogs, menus, toasts) are captured too.
  await expect(page.elementLocator(document.body)).toMatchScreenshot(
    toSlug(ctx.task.name)
  );
});
