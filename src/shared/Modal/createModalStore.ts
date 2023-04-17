import { create } from "zustand";

type IModalStore<Item> = {
  selectedItem: Item | null;
  isOpen: boolean;
  onOpen(item?: Item): void;
  onClose(): void;
};

export function createModalStore<Item>(store?: Partial<IModalStore<Item>>) {
  return create<IModalStore<Item>>((set) => {
    return {
      selectedItem: null,
      isOpen: false,
      onOpen(item) {
        set({ selectedItem: item ?? null, isOpen: true });
      },
      onClose() {
        set({ isOpen: false, selectedItem: null });
      },
      ...store,
    };
  });
}
