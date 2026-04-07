---
title: Notification Hook
category: Component Patterns
layer: application/
composedWith: use-case-hook
---

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
