import { createModalStore } from "@/lib/components/Modal/create-modal-store";

// AIDEV-NOTE: open/close state for the checkout dialog. Lives in the checkout slice so the
// whole flow (trigger + dialog + machine) is owned here, not in carts. See 003.
export const useCheckoutDialogStore = createModalStore();
