import { mutationOptions } from "@tanstack/react-query";

// AIDEV-NOTE: stub implementation — replace mutationFn with real HTTP call once MSW mock is ready
export const purchaseMutationOptions = mutationOptions({
  mutationFn: async (): Promise<void> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 400));
  },
});
