import { setProjectAnnotations } from "@storybook/react-vite";

import * as projectAnnotations from "./preview";

// AIDEV-NOTE: Chakra-only workaround for a Storybook 10 + Zag incompatibility.
//
// Storybook 10 redefines HTMLElement.prototype.focus as an *accessor* whose getter
// dereferences `this.ownerDocument` (storybook/dist/csf/index.js, in `enhanceContext`).
// @zag-js/focus-visible reads that property off the prototype itself:
//
//     let focus = win.HTMLElement.prototype.focus   // `this` === the prototype
//
// so the getter runs with a non-element receiver and throws "TypeError: Illegal
// invocation". @zag-js/focus-visible is the only dependency in this tree that touches
// HTMLElement.prototype, and it is reached exclusively through Chakra UI (Chakra 3 is
// built on Zag) — nothing in our own code triggers this.
//
// Every Zag component calling trackFocusVisible is affected: checkbox, select, tooltip,
// switch, menu, radio-group, combobox, listbox, cascade-select. The throw happens inside
// a Zag effect rather than the assertion path, so stories still pass — it only surfaces
// as Vitest "unhandled errors", which fail the run via a non-zero exit code.
//
// Storybook installs its patch in a per-story loader, so it re-wins over anything defined
// at setup time. Instead we intercept defineProperty/defineProperties and harden the focus
// getter as it is installed: a non-element receiver gets the original function, while real
// elements delegate to Storybook's getter so its focus tracking still works.
//
// AIDEV-TODO: remove once @zag-js/focus-visible stops reading `focus` off the prototype
// (or Storybook stops defining it as an accessor). Re-check on Chakra/Zag upgrades.
const guardFocusDescriptor = (
  descriptor: PropertyDescriptor
): PropertyDescriptor => {
  const getter = descriptor.get;
  if (typeof getter !== "function") return descriptor;

  return {
    ...descriptor,
    get(this: unknown) {
      const isElement =
        typeof HTMLElement !== "undefined" && this instanceof HTMLElement;
      if (!isElement) return originalFocus;
      return getter.call(this) as unknown;
    },
  };
};

const originalFocus = HTMLElement.prototype.focus;
const originalDefineProperty = Object.defineProperty.bind(Object);
const originalDefineProperties = Object.defineProperties.bind(Object);

Object.defineProperty = ((
  target: object,
  key: PropertyKey,
  descriptor: PropertyDescriptor
) => {
  const next =
    target === HTMLElement.prototype && key === "focus"
      ? guardFocusDescriptor(descriptor)
      : descriptor;
  return originalDefineProperty(target, key, next);
}) as typeof Object.defineProperty;

Object.defineProperties = ((
  target: object,
  descriptors: PropertyDescriptorMap
) => {
  if (target !== HTMLElement.prototype || !("focus" in descriptors)) {
    return originalDefineProperties(target, descriptors);
  }
  return originalDefineProperties(target, {
    ...descriptors,
    focus: guardFocusDescriptor(descriptors.focus),
  });
}) as typeof Object.defineProperties;

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([projectAnnotations]);
