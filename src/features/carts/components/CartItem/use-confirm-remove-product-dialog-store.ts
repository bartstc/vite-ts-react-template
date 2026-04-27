import { createModalStore } from "@/lib/components/Modal/create-modal-store";

interface RemoveProductDialogItem {
  productId: string;
  quantity: number;
  mode: "decrement" | "remove-all";
}

export const useConfirmRemoveProductDialogStore =
  createModalStore<RemoveProductDialogItem>();
