import { Category } from "@/features/products/models/category";
import { useTranslations } from "@/lib/i18n/use-transations";

export const useCategoryLabel = (category: Category) => {
  const t = useTranslations("features.products.categories");
  const key = messageKeys[category];
  return key ? t(key) : category;
};

const messageKeys = {
  [Category.Women_clothing]: "women-clothing",
  [Category.Men_clothing]: "men-clothing",
  [Category.Jewelery]: "jewelery",
  [Category.Electronics]: "electronics",
};
